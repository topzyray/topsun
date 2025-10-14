"use client";

import { useRouter } from "next/navigation";
import { Separator } from "../../ui/separator";
import { useState } from "react";
import PaymentFormBank from "../../forms/payment/payment-form-bank";
import PaymentFormCard from "../../forms/payment/payment-form-card";
import { useAuth } from "@/api/hooks/use-auth.hook";
import BackButton from "../../buttons/BackButton";

export default function MakePayment() {
  const [renderFee, setRenderFee] = useState({
    bankPaymentForm: true,
    cardPaymentForm: false,
  });
  const { userDetails } = useAuth();

  return (
    <div className="mx-auto space-y-2">
      <BackButton />

      <div className="space-y-4">
        <Separator />
        <h1 className="mb-6 text-xl uppercase">School Fee Payment Page</h1>
        <Separator />
        <div>
          <p className="text-center text-3xl uppercase">Coming Soon</p>
        </div>
        {/* <div className="space-y-2">
          <div className="bg-sidebar w-max flex text-sm">
            <div
              onClick={() =>
                setRenderFee((prev) => ({
                  ...prev,
                  bankPaymentForm: true,
                  cardPaymentForm: false,
                }))
              }
              className={`py-3 px-4 cursor-pointer hover:opacity-75 md:text-lg ${
                !renderFee.bankPaymentForm
                  ? "bg-sidebar text-foreground"
                  : "text-background bg-foreground"
              }`}
            >
              Bank payment
            </div>
            <div
              onClick={() =>
                setRenderFee((prev) => ({
                  ...prev,
                  bankPaymentForm: false,
                  cardPaymentForm: true,
                }))
              }
              className={`py-3 px-4 cursor-pointer hover:opacity-75 md:text-lg ${
                !renderFee.cardPaymentForm
                  ? "bg-sidebar text-foreground"
                  : "text-background bg-foreground"
              }`}
            >
              Card payment
            </div>
          </div>
          {renderFee.bankPaymentForm && (
            <div>
              <PaymentFormBank
                action_from={
                  userDetails?.role === "parent"
                    ? "parent"
                    : userDetails?.role === "student"
                    ? "student"
                    : ""
                }
              />
            </div>
          )}

          {renderFee.cardPaymentForm && (
            <div>
              <PaymentFormCard
                action_from={
                  userDetails?.role === "parent"
                    ? "parent"
                    : userDetails?.role === "student"
                    ? "student"
                    : ""
                }
              />
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}
