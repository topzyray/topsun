import ResultsComponent from "@/components/pages/school/results";

export default async function MyStudentResultsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ResultsComponent params={await params} />;
}
