import AdminDetails from "@/components/pages/school/admins/admin-details";

export default async function TeacherDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <AdminDetails params={await params} />;
}
