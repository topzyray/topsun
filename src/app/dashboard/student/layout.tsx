import type { Metadata } from "next";
import { dashboardTitle } from "@/constants";
import { student } from "@/utils/nav-items";
import { cookies } from "next/headers";
import DashboardLayout from "@/components/global/dashboard-layout";

export const metadata: Metadata = {
  title: dashboardTitle.student,
};

export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebarState")?.value === "true";
  return (
    <DashboardLayout
      role="student"
      dashboardTitle="Student"
      navItems={student}
      defaultOpen={defaultOpen}
    >
      {children}
    </DashboardLayout>
  );
}
