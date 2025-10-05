import ResultDetails from "@/components/pages/school/result-details";

export default async function ResultDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ResultDetails params={await params} />;
}
