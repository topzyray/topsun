import FeePaymentDetails from "@/components/pages/school/fee-payment-details";

export default async function FeePaymentDetailsPage({
  params,
}: {
  params: Promise<Record<string, any>>;
}) {
  return <FeePaymentDetails params={await params} />;
}
