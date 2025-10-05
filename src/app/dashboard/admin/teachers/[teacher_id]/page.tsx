import TeacherDetails from "@/components/pages/school/admins/teacher-details";

export default async function TeacherDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <TeacherDetails params={await params} />;
}
