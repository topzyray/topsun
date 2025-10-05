import CreateExamTimetableComponent from "@/components/pages/cbt/teachers/create-exam-timetable";

export default async function CreateExamTimetablePage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <CreateExamTimetableComponent params={await params} />;
}
