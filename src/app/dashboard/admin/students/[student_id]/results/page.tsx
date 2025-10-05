import ResultsComponent from "@/components/pages/school/results";

export default async function StudentResultsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ResultsComponent params={await params} />;
}
