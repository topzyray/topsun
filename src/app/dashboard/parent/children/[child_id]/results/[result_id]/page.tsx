import ResultDetails from "@/components/pages/school/result-details";

export default async function ResultDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ResultDetailsPageClient params={await params} />;
}

function ResultDetailsPageClient({ params }: { params: Record<string, any> }) {
  params.student_id = params.child_id;
  return <ResultDetails params={params} />;
}
