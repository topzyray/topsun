"use client";

import { PaymentApiService } from "@/api/services/PaymentApiService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormDescription, FormLabel } from "../../ui/form";
import InputComponent from "../base/input-component";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { Parent, Student } from "../../../../types";
import { usePathname, useRouter } from "next/navigation";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { CircularLoader } from "../../loaders/page-level-loader";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "../../ui/separator";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { ParentApiService } from "@/api/services/ParentApiService";
import ErrorBox from "@/components/atoms/error-box";
import SubmitButton from "@/components/buttons/SubmitButton";

const CardPaymentFormSchema = z.object({
  amount_paying: z.string().min(1, {
    message: "Amount paid is required",
  }),
});

export default function PaymentFormCard({
  action_from,
}: {
  action_from: "student" | "parent" | "";
}) {
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const [childData, setChildData] = useState<Student | null>(null);
  const { activeSessionData } = useContext(GlobalContext);
  const router = useRouter();
  const student_data = userDetails as Student;
  const parent_data = userDetails as Parent;
  const pathname = usePathname();

  useEffect(() => {
    const payment_ref =
      localStorage.getItem("card_transaction_ref") !== null &&
      JSON.parse(localStorage.getItem("card_transaction_ref") as string);

    const studentId =
      localStorage.getItem("studentId") !== null &&
      JSON.parse(localStorage.getItem("studentId") as string);

    if (payment_ref || studentId) {
      localStorage.removeItem("card_transaction_ref");
      localStorage.removeItem("studentId");
    }
  }, []);

  let { data, isLoading, isError, error } = useCustomQuery(
    ["students", "studentById"],
    () => ParentApiService.getAllLinkedStudentsInSchools(parent_data._id),
    {},
    action_from === "parent",
  );

  let children: Student[] = data?.students?.students !== undefined && data?.students?.students;

  const paymentObj = {
    current_debt:
      action_from == "student"
        ? student_data?.outstanding_balance
        : action_from === "parent"
          ? childData?.outstanding_balance
          : 0,
    remaining_fee:
      action_from == "student"
        ? student_data?.latest_payment_document?.remaining_amount
        : action_from === "parent"
          ? childData?.latest_payment_document?.remaining_amount
          : 0,
    current_term_fee:
      action_from == "student"
        ? student_data?.latest_payment_document?.total_amount
        : action_from === "parent"
          ? childData?.latest_payment_document?.total_amount
          : 0,
  };

  const studentPayment = {
    ...paymentObj,
    total_amount_payable: (Number(paymentObj?.current_debt) +
      Number(paymentObj?.remaining_fee)) as number,
  };

  useEffect(() => {
    if (action_from === "parent") {
      const current_child_id_arr = pathname.slice(1).split("/");

      const child_obj =
        children.length > 0 && children.find((child) => child._id == current_child_id_arr[3]);

      if (child_obj) {
        setChildData(child_obj);
      }
    }
  }, [action_from, pathname, children]);

  const form = useForm<z.infer<typeof CardPaymentFormSchema>>({
    resolver: zodResolver(CardPaymentFormSchema),
    defaultValues: {
      amount_paying: "",
    },
  });

  const studentIdForMutation =
    action_from === "student" ? student_data?._id : action_from === "parent" ? childData?._id : "";

  let { mutate: makeCardPayment, isPending: isMakingCardPayment } = useCustomMutation(
    PaymentApiService.makeCardPayment,
    {
      onSuccessCallback: (data) => {
        queryClient.invalidateQueries({ queryKey: ["payments"] });
        queryClient.invalidateQueries({ queryKey: ["paymentById"] });
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: ["studentById"] });
        form.reset();
        StorageUtilsHelper.saveToLocalStorage([
          "card_transaction_ref",
          data.payment.reference || null,
        ]);
        StorageUtilsHelper.saveToLocalStorage(["studentId", studentIdForMutation]);
        router.push(data.payment.authorization_url);
      },
    },
  );

  async function onSubmit(data: z.infer<typeof CardPaymentFormSchema>) {
    const classId =
      action_from === "student"
        ? student_data?.current_class?.class_id._id
        : action_from === "parent"
          ? childData?.current_class.class_id
          : "";

    const studentId =
      action_from === "student" ? student_data._id : action_from === "parent" ? childData?._id : "";

    makeCardPayment({
      formData: {
        ...data,
        amount_paying: Number(data.amount_paying),
        term: activeSessionData?.activeTerm?.name as string,
        class_id: classId,
      },
      params: {
        session_id: activeSessionData?.activeSession?._id as string,
        student_id: studentId as string,
      },
    });
  }

  const amount_paying_data = form.watch("amount_paying");

  return (
    <div className="w-full max-w-lg">
      {activeSessionData.loading || (action_from === "parent" && isLoading) ? (
        <CircularLoader text="Loading form data" />
      ) : activeSessionData?.activeSession || (action_from === "parent" && children.length > 0) ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 border px-4 py-6"
          >
            <div className="rounded border px-2.5 py-1.5">
              {studentPayment.total_amount_payable > 0 ? (
                <>
                  <p className="flex gap-2">
                    <FormDescription>Current student debt:</FormDescription>
                    <FormDescription className="text-red-600">
                      ₦{studentPayment?.current_debt}
                    </FormDescription>
                  </p>
                  <p className="flex gap-2">
                    <FormDescription>Current school fee:</FormDescription>
                    <FormDescription className="text-green-600">
                      ₦{studentPayment.remaining_fee}
                    </FormDescription>
                  </p>
                  <p className="flex gap-2">
                    <FormDescription>Total amount to pay:</FormDescription>
                    <FormDescription className="font-bold">
                      ₦{studentPayment.total_amount_payable}
                    </FormDescription>
                  </p>
                </>
              ) : !studentPayment?.total_amount_payable ? (
                <FormDescription>
                  Student has no payment document or not enrolled yet.
                </FormDescription>
              ) : studentPayment.total_amount_payable == 0 ? (
                <FormDescription className="text-green-600">
                  Note: All outstanding and current school fee paid
                </FormDescription>
              ) : null}
            </div>

            <Separator />

            <FormLabel className="text-base">Card payment form</FormLabel>

            <FormDescription className="text-orange-600">
              Note: Use this form if you are paying with card.
            </FormDescription>

            <InputComponent
              formName="amount_paying"
              formControl={form.control}
              formLabel="Amount paid"
              formPlaceholder="Enter amount paid"
              disabled={
                isMakingCardPayment ||
                studentPayment.total_amount_payable <= 0 ||
                !studentPayment.total_amount_payable
              }
              formInputType="text"
            />

            <div className="flex justify-start">
              <SubmitButton
                disabled={
                  !form.formState.isValid ||
                  isMakingCardPayment ||
                  studentPayment.total_amount_payable <= 0 ||
                  +amount_paying_data > studentPayment.total_amount_payable ||
                  !studentPayment.total_amount_payable
                }
                loading={isMakingCardPayment}
              />
            </div>
          </form>
        </Form>
      ) : activeSessionData.error || (action_from === "parent" && isError) ? (
        <div>
          {action_from === "parent" && <ErrorBox error={error} />}
          <ErrorBox error={activeSessionData.error} />
        </div>
      ) : (
        <ErrorBox message="No student data found." />
      )}
    </div>
  );
}
