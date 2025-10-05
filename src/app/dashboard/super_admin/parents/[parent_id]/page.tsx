import ParentDetails from "@/components/pages/school/admins/parent-details";

export default async function ParentDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ParentDetails params={await params} />;
}
