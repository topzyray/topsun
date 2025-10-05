import type { Metadata } from "next";
import { dashboardTitle } from "@/constants";
import { super_admin_nav } from "@/utils/nav-items";
import { cookies } from "next/headers";
import DashboardLayout from "@/components/global/dashboard-layout";

export const metadata: Metadata = {
  title: dashboardTitle.super_admin,
};

export default async function SuperAdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";
  return (
    <DashboardLayout
      role="super_admin"
      dashboardTitle="Super Admin"
      navItems={super_admin_nav}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardLayout>
  );
}
