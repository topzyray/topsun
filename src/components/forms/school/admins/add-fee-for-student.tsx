"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormLabel } from "@/components/ui/form";
import InputComponent from "../../base/input-component";
import { ScrollArea } from "../../../ui/scroll-area";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { PaymentApiService } from "@/api/services/PaymentApiService";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { PaymentPriority, SchoolAccount } from "../../../../../types";
import ErrorBox from "@/components/atoms/error-box";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { ComboboxComponent } from "../../base/combo-box-component";
import { SchoolAccountsApiService } from "@/api/services/SchoolAccountsApiService";
import { Card } from "@/components/ui/card";

const AddFeeFormSchema = z.object({
  fee_name: z.string().min(1, {
    message: "Fee name is required",
  }),
  amount: z.coerce.number().min(1, {
    message: "Amount is required",
  }),
  account_number: z.string().min(10, {
    message: "School account is required",
  }),
  account_name: z.string(),
  bank_name: z.string(),
});

export default function AddFeeForStudent({
  student_id,
  onClose,
  closeOnSuccess,
}: {
  student_id: string;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { activeSessionData } = useContext(GlobalContext);

  const { data, isLoading, isError, error } = useCustomQuery(
    ["payments"],
    PaymentApiService.getPaymentPriorityForMySchool,
  );

  let paymentPriorityData: PaymentPriority[] =
    data?.payment_priority?.priority_order !== undefined
      ? data?.payment_priority?.priority_order
      : [];

  const form = useForm<z.infer<typeof AddFeeFormSchema>>({
    resolver: zodResolver(AddFeeFormSchema),
    defaultValues: {
      fee_name: "",
      amount: 0,
      account_number: "",
      account_name: "",
      bank_name: "",
    },
  });

  let {
    data: schoolAccount,
    isLoading: isLoadingAccount,
    isError: isAccountError,
    error: accountError,
  } = useCustomQuery(["schoolAccount"], SchoolAccountsApiService.getMySchoolAccounts);

  const school_account: SchoolAccount[] =
    schoolAccount?.accounts?.accounts !== undefined && schoolAccount?.accounts?.accounts;

  let { mutate: addFeeToStudentPayment, isPending: isAddingFee } = useCustomMutation(
    PaymentApiService.addFeeToStudentPaymentDocumentInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: ["studentById"] });
        queryClient.invalidateQueries({ queryKey: [student_id] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof AddFeeFormSchema>) {
    const account_id = school_account.find(
      (account) => account?.account_number === data?.account_number,
    )?._id;

    addFeeToStudentPayment({
      requestBody: {
        fee_name: data.fee_name,
        amount: data.amount,
        receiving_acc_id: account_id as string,
        student_id,
      },
      params: {
        session_id: activeSessionData?.activeSession?._id as string,
      },
    });
  }

  const account_number = form.watch("account_number");

  useEffect(() => {
    if (account_number) {
      school_account.length > 0 &&
        school_account.forEach((account: SchoolAccount) => {
          if (account.account_number === account_number) {
            form.setValue("account_name", account.account_name);
            form.setValue("bank_name", account.bank_name);
          }
        });
    }
  }, [school_account, account_number, form]);

  return (
    <div className="bg-background w-full max-w-[28rem] rounded">
      {isLoading ? (
        <CircularLoader text="Loading form data" />
      ) : paymentPriorityData && paymentPriorityData.length > 0 ? (
        <ScrollArea className="bg-background h-full max-h-[80vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
            >
              <FormLabel className="text-center text-lg uppercase">Add Fee Form</FormLabel>

              <ComboboxComponent
                formName="fee_name"
                formControl={form.control}
                formLabel="Fee Name"
                formPlaceholder=""
                formOptionLabel="Select fee name"
                formOptionData={paymentPriorityData}
                disabled={isAddingFee}
                valueField="fee_name"
                displayValue={(data) => `${data.fee_name}`}
              />

              <InputComponent
                formName="amount"
                formControl={form.control}
                formLabel="Amount"
                formPlaceholder=""
                disabled={isAddingFee}
                formInputType="number"
              />

              {isLoadingAccount ? (
                <CircularLoader text="Loading form data" />
              ) : school_account && school_account.length > 0 ? (
                <div>
                  <ComboboxComponent
                    formName="account_number"
                    formControl={form.control}
                    formLabel="School Accounts"
                    formPlaceholder=""
                    formOptionLabel="Select class"
                    formOptionData={school_account as SchoolAccount[]}
                    disabled={isAddingFee}
                    valueField="account_number"
                    displayValue={(data) => `${data.account_number}`}
                  />

                  <InputComponent
                    formName="account_name"
                    formControl={form.control}
                    formLabel="Account Name"
                    formInputType="text"
                    disabled={isAddingFee}
                    readOnly={true}
                  />

                  <InputComponent
                    formName="bank_name"
                    formControl={form.control}
                    formLabel="Bank Name"
                    formInputType="text"
                    disabled={isAddingFee}
                    readOnly={true}
                  />
                </div>
              ) : isAccountError ? (
                <ErrorBox error={accountError} />
              ) : (
                <Card className="space-y-4 rounded-none p-4">
                  <p className="text-center">No school account available yet</p>
                </Card>
              )}

              <div className="flex justify-center gap-6">
                <CancelButton
                  onClose={() => {
                    form.reset();
                    onClose();
                  }}
                />

                {
                  <SubmitButton
                    disabled={!form.formState.isValid || isAddingFee}
                    loading={isAddingFee}
                    text="Add Fee"
                  />
                }
              </div>
            </form>
          </Form>
        </ScrollArea>
      ) : isError ? (
        <ErrorBox error={error} />
      ) : (
        <ErrorBox message="No form data found. Please reload page." />
      )}
    </div>
  );
}
