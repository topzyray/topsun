"use client";

import { GlobalContext } from "@/providers/global-state-provider";
import { useContext, useEffect, useMemo, useState } from "react";
import { CircularLoader } from "../../loaders/page-level-loader";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { PaymentApiService } from "@/api/services/PaymentApiService";
import { Student, TransactionResponse } from "../../../../types";
import PaymentReceipt from "../../payment-reciept";
import { Button } from "../../ui/button";
import { StudentApiService } from "@/api/services/StudentApiService";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { STORE_KEYS } from "@/configs/store.config";
import toast from "react-hot-toast";

export default function CardPaymentStatus() {
  const [paymentStatusObj, setPaymentStatusObj] = useState<{
    paymentStatus: TransactionResponse | null;
    error: string | null;
  }>({
    paymentStatus: null,
    error: null,
  });
  const { pageLevelLoader, setPageLevelLoader } = useContext(GlobalContext);
  const { userDetails, setUserDetails } = useAuth();

  const params = useSearchParams();
  const router = useRouter();

  const allowedUsers = useMemo(() => ["student", "parent"], []);

  useEffect(() => {
    setPageLevelLoader(true);

    if (userDetails == null) {
      router.push("/login");
    } else if (!allowedUsers.includes(userDetails.role)) {
      router.push(`/dashboard/${userDetails.role}/overview`);
    }

    const process_final_payment = async () => {
      setPaymentStatusObj({
        paymentStatus: null,
        error: null,
      });
      const payment_ref =
        localStorage.getItem("card_transaction_ref") !== null &&
        JSON.parse(localStorage.getItem("card_transaction_ref") as string);

      const studentId =
        localStorage.getItem("studentId") !== null &&
        JSON.parse(localStorage.getItem("studentId") as string);

      if (payment_ref !== null) {
        if (params.get("reference") === payment_ref) {
          try {
            const response = await PaymentApiService.getCardPaymentStatus({
              reference: payment_ref,
              student_id: studentId,
            });

            setPaymentStatusObj((prev) => ({
              ...prev,
              paymentStatus: response.payment_response.receipt,
              error: null,
            }));

            localStorage.removeItem("card_transaction_ref");

            setPageLevelLoader(false);

            if (userDetails?.role === "student") {
              const data = await StudentApiService.getStudentByIdInASchool(userDetails?._id);

              StorageUtilsHelper.saveToLocalStorage([
                STORE_KEYS.USER_DETAILS,
                {
                  ...userDetails,
                  latest_payment_document: data?.student?.latest_payment_document,
                },
              ]);
              setUserDetails({
                ...userDetails,
                latest_payment_document: data?.student?.latest_payment_document,
              } as Student);
            }
          } catch (error: any) {
            toast.error(error.message);
            setPaymentStatusObj((prev) => ({
              ...prev,
              error: error.message,
            }));
            // StorageUtilsHelper.deleteFromLocalStorage()
            localStorage.removeItem("card_transaction_ref");
            setTimeout(() => {
              if (userDetails?.role === "student") {
                router.replace(`/dashboard/student/fee_payments/make_payment`);
              } else if (userDetails?.role === "parent") {
                router.replace(`/dashbaord/parent/children/${studentId}/make_payment`);
                localStorage.removeItem("studentId");
              }
            }, 5000);

            setPageLevelLoader(false);
          }
        } else {
          setPaymentStatusObj((prev) => ({
            ...prev,
            error: "Payment not successful. Transaction reference does not match. Please try again",
          }));
          setPageLevelLoader(false);
          localStorage.removeItem("card_transaction_ref");
          setTimeout(() => {
            if (userDetails?.role === "student") {
              router.replace(`/dashboard/student/fee_payments/make_payment`);
            } else if (userDetails?.role === "parent") {
              router.replace(`/dashbaord/parent/children/${studentId}/make_payment`);
              localStorage.removeItem("studentId");
            }
          }, 5000);
        }
      } else {
        setPaymentStatusObj((prev) => ({
          ...prev,
          error: "Payment not successful. Transaction reference not found. Please try again",
        }));
        setPageLevelLoader(false);
        localStorage.removeItem("card_transaction_ref");
        setTimeout(() => {
          if (userDetails?.role === "student") {
            router.replace(`/dashboard/student/fee_payments/make_payment`);
          } else if (userDetails?.role === "parent") {
            router.replace(`/dashbaord/parent/children/${studentId}/make_payment`);
            localStorage.removeItem("studentId");
          }
        }, 5000);
      }
    };

    process_final_payment();
  }, [allowedUsers, params, router, setPageLevelLoader, setUserDetails, userDetails]);

  const successfulTransaction = {
    status: paymentStatusObj?.paymentStatus?.status,
    transaction_id: paymentStatusObj?.paymentStatus?.transaction_id,
    amount_paid: paymentStatusObj?.paymentStatus?.amount_paid,
    payment_method: paymentStatusObj?.paymentStatus?.payment_method,
    date_paid: paymentStatusObj?.paymentStatus?.date_paid,
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="">
        {pageLevelLoader && <CircularLoader text="Confirming payment status. Please wait..." />}
      </div>

      {paymentStatusObj.error !== null && (
        <div className="bg-sidebar flex max-w-md flex-col justify-center gap-4 rounded p-6">
          <div className="flex flex-col justify-center gap-4">
            <p className="text-center text-red-600">{paymentStatusObj.error}</p>
            <Button
              onClick={() =>
                router.push(`/dashboard/${userDetails?.role}/fee_payments/make_payment`)
              }
              className="mx-auto w-max"
            >
              Try again
            </Button>
          </div>
        </div>
      )}

      {paymentStatusObj.paymentStatus !== null && (
        <div className="px-4">
          <PaymentReceipt {...(successfulTransaction as TransactionResponse)} />
        </div>
      )}
    </div>
  );
}
