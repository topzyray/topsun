import SessionDetails from "@/components/pages/school/admins/session-details";

export default async function SessionDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <SessionDetails params={await params} />;
}
