import ExamTimetableComponent from "@/components/pages/cbt/teachers/exam-timetable";

export default async function ExamTimetableManagement({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ExamTimetableComponent params={await params} />;
}
