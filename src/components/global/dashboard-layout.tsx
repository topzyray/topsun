"use client";

import { DashBoardSidebar } from "@/components/global/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { EventSidebar } from "@/components/global/event-sidebar";
import { DashboardTitleType, NavItems, Term, User, UserRole } from "../../../types";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { SessionApiService } from "@/api/services/SessionApiService";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { STORE_KEYS } from "@/configs/store.config";
import { ClassApiService } from "@/api/services/ClassApiService";
import { RouteGuard } from "@/HOCs/guards/RouteGuard";
import DashboardHeader from "./dashboard-header";

interface DashboardLayout {
  navItems: NavItems;
  role: UserRole;
  dashboardTitle: DashboardTitleType;
  defaultOpen: boolean;
  children: React.ReactNode;
}

export default function DashboardLayout({
  navItems,
  role,
  dashboardTitle,
  children,
}: Readonly<DashboardLayout>) {
  const { userDetails: userData } = useAuth();
  const { setActiveSessionData, setClassLevel } = useContext(GlobalContext);

  const {
    data: activeSessionApiData,
    isLoading: isLoadingActiveSessionApiData,
    isError: isActiveSessionDataError,
    error: activeSessionDataError,
  } = useCustomQuery(["activeSessions"], SessionApiService.getActiveSessionForSchool);

  useEffect(() => {
    if (isLoadingActiveSessionApiData) {
      setActiveSessionData((prev) => ({
        ...prev,
        loading: isLoadingActiveSessionApiData,
      }));
    } else if (activeSessionApiData) {
      StorageUtilsHelper.saveToLocalStorage([
        STORE_KEYS.ACTIVE_SESSION_DATA,
        {
          activeSession: activeSessionApiData?.session || null,
          activeTerm:
            activeSessionApiData?.session?.terms.find((term: Term) => term.is_active) || null,
        },
      ]);
      setActiveSessionData((prev) => ({
        ...prev,
        activeSession: activeSessionApiData?.session,
        activeTerm:
          activeSessionApiData?.session?.terms.find((term: Term) => term.is_active) || null,
        loading: false,
        error: null,
      }));
    } else if (isActiveSessionDataError) {
      setActiveSessionData((prev) => ({
        ...prev,
        error: activeSessionDataError,
        loading: false,
        activeSession: null,
        activeTerm: null,
      }));
    }
  }, [
    activeSessionApiData,
    isLoadingActiveSessionApiData,
    isActiveSessionDataError,
    activeSessionDataError,
    setActiveSessionData,
  ]);

  const {
    data: classLevelApiData,
    isLoading: isLoadingClassLevelData,
    isError: isClassLevelDataError,
    error: classLevelDataError,
  } = useCustomQuery(
    ["class_level"],
    ClassApiService.getSchoolClassLevel,
    {},
    userData?.role === "super_admin" || userData?.role === "admin",
  );

  useEffect(() => {
    if (isLoadingClassLevelData) {
      setClassLevel((prev) => ({
        ...prev,
        loading: isLoadingClassLevelData,
      }));
    } else if (classLevelApiData) {
      StorageUtilsHelper.saveToLocalStorage([
        STORE_KEYS.CLASS_LEVEL_DATA,
        {
          data: classLevelApiData?.class_level || null,
        },
      ]);
      setClassLevel((prev) => ({
        ...prev,
        data: classLevelApiData?.class_level,
        loading: false,
        error: null,
      }));
    } else if (isClassLevelDataError) {
      setClassLevel((prev) => ({
        ...prev,
        error: classLevelDataError,
        loading: false,
        data: null,
      }));
    }
  }, [
    classLevelApiData,
    isLoadingClassLevelData,
    isClassLevelDataError,
    classLevelDataError,
    setClassLevel,
  ]);

  return (
    <RouteGuard protected roles={[role]}>
      <SidebarProvider defaultOpen>
        <DashBoardSidebar navItems={navItems} />
        <main className="relative max-h-screen w-full">
          <DashboardHeader dashboardTitle={dashboardTitle} userData={userData as User} />
          <section className="flex pt-14">
            <section className="w-full p-4 sm:p-4">{children}</section>
            <EventSidebar />
          </section>
        </main>
      </SidebarProvider>
    </RouteGuard>
  );
}
