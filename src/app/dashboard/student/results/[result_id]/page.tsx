import ResultDetails from "@/components/pages/school/result-details";

export default async function ResultDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  // const { userDetails } = useAuth();
  // const student = (userDetails as Student) ?? {};
  // params.student_id = student?._id;
  return <ResultDetails params={await params} />;
}
