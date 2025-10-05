import EnrollmentDetails from "@/components/pages/school/admins/enrollment-details";

export default async function EnrollmentDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <EnrollmentDetails params={await params} />;
}
