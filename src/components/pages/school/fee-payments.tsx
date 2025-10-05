"use client";

import { useState } from "react";
import { Separator } from "../../ui/separator";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { PaymentApiService } from "@/api/services/PaymentApiService";
import { Student } from "../../../../types";
import BackButton from "@/components/buttons/BackButton";

export default function FeePaymentComponent() {
  const [openBusSubscriptionForm, setOpenBusSubscriptionForm] = useState(false);
  // const [showBusSubscriptionAlert, setShowBusSubscriptionAlert] =
  //   useState(false);

  const { userDetails } = useAuth();
  const student = userDetails as Student;

  let { data } = useCustomQuery(["payments", student?._id as string], () =>
    PaymentApiService.getPaymentTransactionHistoryForStudent(student?._id as string),
  );

  data = data?.payment_history?.paymentObj !== undefined && data?.payment_history?.paymentObj;

  // useEffect(() => {
  //   if (student?.latest_payment_document?.is_submit_response === false) {
  //     setShowBusSubscriptionAlert(true);
  //   }
  // }, [student?.latest_payment_document?.is_submit_response]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <div className="space-y-4">
        <Separator />
        <h1 className="mb-6 text-xl uppercase">School Fee Payment Page</h1>
        <Separator />
        <div className="mt-4">
          <p className="text-center text-3xl uppercase">Coming Soon</p>
        </div>

        {/* <div className="flex gap-2">
        {student?.is_updated && (
          <Button onClick={() => router.push("fee_payments/make_payment")}>
            Make payment
          </Button>
        )}
      </div> */}
        {/* <div>
        <Separator />

        <div className="py-4">
          <h1 className="text-xl uppercase">Student Transaction History</h1>
        </div>

        <Separator />

        <div>
          <PaymentTransactionHistoryTable
            data={data}
            isLoading={isLoading}
            isError={isError}
            error={error}
          />
        </div>
      </div> */}
        {/* <ModalComponent
        open={openBusSubscriptionForm}
        onClose={() => setOpenBusSubscriptionForm(false)}
      >
        <BusSubscriptionForm
          action_from="student"
          onClose={() => setOpenBusSubscriptionForm(false)}
          closeOnSuccess={() => {
            setOpenBusSubscriptionForm(false);
          }}
        />
      </ModalComponent> */}

        {/* Shows bus subscription alerts */}
        {/* <ModalComponent
        open={showBusSubscriptionAlert}
        onClose={() => setShowBusSubscriptionAlert(false)}
      >
        <BusSubscriptionAlert
          message="You need"
          onClose={() => setShowBusSubscriptionAlert(false)}
          closeOnSuccess={() => {
            setShowBusSubscriptionAlert(false);
            setOpenBusSubscriptionForm(true);
          }}
        />
      </ModalComponent> */}
      </div>
    </div>
  );
}
