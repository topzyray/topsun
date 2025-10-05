"use client";

import { Separator } from "@/components/ui/separator";
import { GlobalContext } from "@/providers/global-state-provider";
import React, { useContext } from "react";
import { PaymentApiService } from "@/api/services/PaymentApiService";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { PaymentTransactionHistoryTable } from "@/components/tables/common/payment-transaction-history-table";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import BackButton from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import TooltipComponent from "@/components/info/tool-tip";

export default function PaymentComponent() {
  const queryClient = useQueryClient();

  const { userDetails } = useAuth();
  const { activeSessionData } = useContext(GlobalContext);

  const { mutate: createPaymentForAllStudents, isPending: isCreatingPaymentForAllStudents } =
    useCustomMutation(PaymentApiService.createPaymentForAllStudents, {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["paymentById"] });
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: ["studentById"] });
      },
    });

  const handleCreatePaymentForAllStudents = async () => {
    createPaymentForAllStudents({
      requestBody: {
        term: activeSessionData?.activeTerm?.name as string,
      },
      params: { session_id: activeSessionData?.activeSession?._id as string },
    });
  };

  let { data, isLoading, isError, error } = useCustomQuery(
    ["payments"],
    PaymentApiService.getAllPaymentTransactionHistories,
  );

  data = data?.payment_summary?.paymentObj !== undefined && data?.payment_summary?.paymentObj;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <>
        {activeSessionData.loading && (
          <CircularLoader
            text="Loading payment creation for students"
            // parentClassName="mt-4 flex h-auto w-max justify-normal text-left text-sm"
          />
        )}

        {activeSessionData.activeSession &&
          activeSessionData.activeTerm &&
          userDetails &&
          userDetails.role == "super_admin" && (
            <div className="flex flex-wrap items-center gap-2">
              <TooltipComponent
                trigger={
                  <div>
                    <SubmitButton
                      disabled={isCreatingPaymentForAllStudents}
                      onSubmit={handleCreatePaymentForAllStudents}
                      loading={isCreatingPaymentForAllStudents}
                      text="Create Payments"
                      type="button"
                    />
                  </div>
                }
                message={"The above button creates payments for all students in the school."}
              />

              {/* {userDetails && userDetails.role === "super_admin" && (
                <Button onClick={() => router.push("payments/cash_payment")}>
                  Process Cash Payments
                </Button>
              )} */}

              {/* {userDetails && userDetails.role && (
                <Button
                  onClick={() => router.push("payments/pending_approval")}
                >
                  Approve bank payments
                </Button>
              )} */}
            </div>
          )}

        {activeSessionData.error !== null && (
          <p className="text-red-600">{activeSessionData?.error?.message}</p>
        )}
      </>
      <div>
        <div className="pb-4">
          <h2 className="text-lg uppercase">All transactions histories</h2>
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
      </div>
    </div>
  );
}
