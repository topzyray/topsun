import DashboardLayout from "@/components/global/dashboard-layout";
import { dashboardTitle } from "@/constants";
import { teaching_staff } from "@/utils/nav-items";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: dashboardTitle.teacher,
};

export default async function TeacherLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";
  return (
    <DashboardLayout
      role="teacher"
      dashboardTitle="Teacher"
      navItems={teaching_staff}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardLayout>
  );
}
