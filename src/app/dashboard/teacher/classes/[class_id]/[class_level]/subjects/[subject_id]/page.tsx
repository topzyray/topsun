import RecordScores from "@/components/pages/school/record-scores";

export default async function TeacherRecordScoresPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <RecordScores params={await params} />;
}
