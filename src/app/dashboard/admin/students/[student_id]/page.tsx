import StudentDetails from "@/components/pages/school/admins/student-details";

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <StudentDetails params={await params} />;
}
