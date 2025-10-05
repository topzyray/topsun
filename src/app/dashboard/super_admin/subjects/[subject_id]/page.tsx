import SubjectDetails from "@/components/pages/school/admins/subject-details";

export default async function SubjectDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <SubjectDetails params={await params} />;
}
