import TicketDetails from "@/components/pages/school/admins/ticket-details";

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <TicketDetails params={await params} />;
}
