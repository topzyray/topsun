import DashboardLayout from "@/components/global/dashboard-layout";
import { dashboardTitle } from "@/constants";
import { school_admin_nav } from "@/utils/nav-items";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: dashboardTitle.admin,
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";
  return (
    <DashboardLayout
      role="admin"
      dashboardTitle="Admin"
      navItems={school_admin_nav}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardLayout>
  );
}
