"use client";

import { Separator } from "@/components/ui/separator";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { PaymentDocument } from "../../../../types";
import { PaymentApiService } from "@/api/services/PaymentApiService";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import BackButton from "../../buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";

export default function FeePaymentDetails({ params }: { params: Record<string, any> }) {
  const { userDetails } = useAuth();
  const student_id = userDetails !== null && userDetails.role == "student" ? userDetails._id : "";

  const { data, isLoading, isError, error } = useCustomQuery(
    ["students", "studentById", "payments", "paymentById"],
    () =>
      PaymentApiService.getStudentOutstandingPaymentById({
        params: {
          payment_id: params.fee_payment_id,
          student_id: student_id,
        },
      }),
    { id: [params.fee_payment_id, student_id] },
  );

  const feePaymentData: PaymentDocument | null = data?.subject !== undefined && data?.subject;

  let status_color;
  switch (feePaymentData?.is_payment_complete) {
    case true:
      status_color = "text-green-600";
      break;
    case false:
      status_color = "text-red-600";
      break;
    default:
      status_color = "";
      break;
  }

  return (
    <div className="space-y-4">
      <BackButton />

      {isLoading && <CircularLoader text="Fetching fee payment details" />}

      {feePaymentData && feePaymentData !== null && (
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          <div className="w-full space-y-3 rounded border p-4 md:max-w-md lg:w-1/2">
            <h2>Payment Document Details</h2>
            <Separator />
            <div className="bg-sidebar w-full space-y-2 p-2">
              <div className="flex justify-between gap-4 text-sm">
                <span>ID:</span>
                <span className="text-wrap">{feePaymentData?._id} </span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span>Term:</span>
                <span>{TextHelper.capitalize(feePaymentData?.term)}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span>Payment status:</span>
                <span className={`${status_color}`}>
                  {feePaymentData?.is_payment_complete ? "Completed" : "Incomplete"}
                </span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span>Remaining amount:</span>
                <span>{feePaymentData?.remaining_amount}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span>Total amount:</span>
                <span>{feePaymentData?.total_amount}</span>
              </div>
              <div className="flex justify-between gap-4 text-sm">
                <span>Date Created:</span>
                <span>{feePaymentData?.createdAt}</span>
              </div>
            </div>
          </div>

          {/* <div className="bg-sidebar p-4 rounded w-full lg:w-1/2 md:max-w-md space-y-3">
            <h2>Terms Details</h2>
            <Separator />
            {feePaymentData?.terms.map((term) => {
              return (
                <Fragment key={term._id}>
                  <div className="space-y-2">
                    <div>
                      <div className="text-sm flex justify-between">
                        <span>Term ID:</span>
                        <span>{term._id}</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span>Term name:</span>
                        <span className="capitalize">{term.name}</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span>Start Date:</span>
                        <span>{TextHelper.getFormattedDate(term.start_date)}</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span>End Date:</span>
                        <span>{TextHelper.getFormattedDate(term.end_date)}</span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span>Status:</span>
                        <span
                          className={`${
                            term.is_active ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {term.is_active ? "Active" : "Ended"}
                        </span>
                      </div>
                      <div className="flex justify-end">
                        {term.is_active && (
                          <p
                            onClick={() => endTerm(feePaymentData._id, term._id)}
                            className="text-sm text-red-600 cursor-pointer hover:text-red-700"
                          >
                            {componentLevelLoader &&
                            componentLevelLoader.loading &&
                            componentLevelLoader.id === term._id ? (
                              <ComponentLevelLoader
                                loading={
                                  componentLevelLoader &&
                                  componentLevelLoader.loading &&
                                  componentLevelLoader.id === term._id
                                }
                                text="Ending term"
                                darkColor="red"
                                lightColor="red"
                              />
                            ) : (
                              "End term"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}

            {feePaymentData?.terms.length < 1 && (
              <p className="text-sm">No term add yet.</p>
            )}
          </div> */}
        </div>
      )}

      {isError && (
        <div className="bg-sidebar max-w-md space-y-3 rounded p-6 text-red-600">
          <p>{extractErrorMessage(error)}</p>
        </div>
      )}
    </div>
  );
}
