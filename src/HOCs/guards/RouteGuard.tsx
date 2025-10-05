"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { UserRole } from "../../../types";
import { RouteHelper } from "@/helpers/RouteHelper";

interface RouteGuardProps {
  children: ReactNode;
  protected?: boolean;
  unprotected?: boolean;
  roles?: UserRole[];
}

export function RouteGuard({
  children,
  protected: isProtected = false,
  unprotected = false,
  roles = [],
}: RouteGuardProps) {
  const { userDetails, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isStudent = userDetails?.role === "student";
  const needsOnboarding = isStudent && userDetails?.is_updated === false;

  useEffect(() => {
    if (loading) return;

    if (isProtected) {
      if (!userDetails && pathname !== "/login") {
        router.replace("/login");
        return;
      }

      if (needsOnboarding && pathname !== "/dashboard/student/onboarding") {
        router.push("/dashboard/student/onboarding");
        return;
      }
      if (roles.length > 0 && userDetails && !roles.includes(userDetails.role)) {
        const target = RouteHelper.getDashboardPath(userDetails);
        if (pathname !== target) router.replace(target);
        return;
      }
    }

    if (unprotected && userDetails) {
      const target = RouteHelper.getDashboardPath(userDetails);
      if (pathname !== target) router.replace(target);
    }
  }, [loading, userDetails, roles, isProtected, unprotected, needsOnboarding, router, pathname]);

  if (loading || (isProtected && !userDetails)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <CircularLoader text="Loading..." />
      </div>
    );
  }

  return children;
}
