"use client";

import PaymentFormCash from "@/components/forms/payment/payment-form-cash";
import { Separator } from "../../../ui/separator";
import BackButton from "@/components/buttons/BackButton";

export default function CashPaymentComponent() {
  return (
    <div className="space-y-2">
      <BackButton />

      <div>
        <Separator />
        <div className="py-4">
          <h2 className="text-lg uppercase">Cash payment page</h2>
        </div>
        <Separator />

        <div className="flex justify-center">
          <PaymentFormCash />
        </div>
      </div>
    </div>
  );
}
