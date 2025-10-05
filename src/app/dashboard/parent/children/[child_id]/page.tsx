import ChildDetails from "@/components/pages/school/child-details";

export default async function ChildDetailPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <ChildDetails params={await params} />;
}
