import ClassDetails from "@/components/pages/school/admins/class-details";

export default async function ClassDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ClassDetails params={await params} />;
}
