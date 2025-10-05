import StudentTeacherManages from "@/components/pages/school/students-teacher-manages";

export default async function StudentsInClassManaging({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <StudentTeacherManages params={await params} />;
}
