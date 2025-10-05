import type { Metadata } from "next";
import { parent } from "@/utils/nav-items";
import DashboardLayout from "@/components/global/dashboard-layout";
import { dashboardTitle } from "@/constants";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: dashboardTitle.parent,
};

export default async function ParentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";
  return (
    <DashboardLayout
      role="parent"
      dashboardTitle="Parent"
      navItems={parent}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardLayout>
  );
}
