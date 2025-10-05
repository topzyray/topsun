"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { ScrollArea } from "../../../ui/scroll-area";
import { FeesApiService } from "@/api/services/FeesApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";
import CancelButton from "@/components/buttons/CancelButton";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import ErrorBox from "@/components/atoms/error-box";
import { ComboboxComponent } from "../../base/combo-box-component";
import { Class, SchoolAccount } from "../../../../../types";
import InputComponent from "../../base/input-component";
import { CommonApiService } from "@/api/services/CommonApiServices";
import { DataHelper } from "@/helpers/DataHelper";
import { TagInputComponent } from "../../base/tag-input-component";

interface AddOptionalFeeForm {
  when: "before_term" | "during_term";
  term?: string;
  onClose: () => void;
  closeOnSuccess: () => void;
}

const formSchema = z.object({
  applicable_classes: z.array(z.string().min(1)),
  fee_name: z.string().min(1, {
    message: "Fee name is required",
  }),
  amount: z.coerce.number().min(0, {
    message: "Amount is required",
  }),
  account_number: z.string().min(10, {
    message: "School account is required",
  }),
  account_name: z.string(),
  bank_name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddOptionalFeeForm({
  when,
  term,
  onClose,
  closeOnSuccess,
}: AddOptionalFeeForm) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicable_classes: [],
      fee_name: "",
      amount: 0,
      account_number: "",
      account_name: "",
      bank_name: "",
    },
  });

  const { data, isLoading, isError, error } = useCustomQuery(
    ["classesSchoolAccount"],
    CommonApiService.getClassAndSchoolAccount,
  );

  const classAndAccountData = {
    classData: (data?.classResponse?.classes as Class[]) ?? [],
    schoolAccounts: (data?.schoolAccountResponse?.accounts?.accounts as SchoolAccount[]) ?? [],
  };

  const allSchoolClassData =
    (classAndAccountData?.classData.length &&
      classAndAccountData?.classData.map((item) => item?.name)) ||
    [];

  const { mutate: createOptionalFee, isPending: isCreatingOptionalFee } = useCustomMutation(
    when === "before_term"
      ? FeesApiService.createOptionalFeesInASchool
      : FeesApiService.addOptionalFeeDuringTerm,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["optionalFees"] });
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: ["studentById"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: FormValues) {
    const account_id = classAndAccountData?.schoolAccounts.find(
      (account) => account?.account_number === data?.account_number,
    )?._id;

    const classIds = DataHelper.getMatchingValues(
      classAndAccountData.classData,
      data.applicable_classes,
      (source, compare) => source.name === compare,
      (source) => source._id,
    );

    createOptionalFee({
      applicable_classes: classIds,
      fee_name: data.fee_name,
      amount: data.amount,
      receiving_acc_id: account_id as string,
      ...(when === "during_term" && { term }),
    });
  }

  const account_number = form.watch("account_number");

  useEffect(() => {
    if (account_number) {
      classAndAccountData?.schoolAccounts.length > 0 &&
        classAndAccountData?.schoolAccounts.forEach((account: SchoolAccount) => {
          if (account.account_number === account_number) {
            form.setValue("account_name", account.account_name);
            form.setValue("bank_name", account.bank_name);
          }
        });
    }
  }, [classAndAccountData.schoolAccounts, account_number, form]);

  return (
    <div className="bg-background w-full max-w-[28rem] rounded">
      {isLoading ? (
        <CircularLoader text="Loading form data" />
      ) : classAndAccountData &&
        classAndAccountData?.classData.length > 0 &&
        classAndAccountData?.schoolAccounts.length > 0 ? (
        <ScrollArea className="h-full max-h-[80vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
            >
              <h2 className="text-center text-lg uppercase">Add Optional Fee Form</h2>

              <InputComponent
                formControl={form.control}
                formName="fee_name"
                formPlaceholder=""
                formInputType="text"
                formLabel="Fee Name"
                disabled={isCreatingOptionalFee}
              />

              <InputComponent
                formControl={form.control}
                formName="amount"
                formPlaceholder=""
                formInputType="number"
                formLabel="Amount"
                disabled={isCreatingOptionalFee}
              />

              {classAndAccountData?.classData.length > 0 ? (
                <TagInputComponent
                  formControl={form.control}
                  formName="applicable_classes"
                  formLabel="Class Involved"
                  formPlaceholder="Add classes"
                  enableSuggestions
                  suggestions={allSchoolClassData}
                />
              ) : (
                <Card className="space-y-4 rounded-none p-4">
                  <p className="text-center">No class available yet</p>
                </Card>
              )}

              {classAndAccountData?.schoolAccounts.length > 0 ? (
                <>
                  <ComboboxComponent
                    formName="account_number"
                    formControl={form.control}
                    formLabel="School Accounts"
                    formPlaceholder=""
                    formOptionLabel="Select account"
                    formOptionData={classAndAccountData?.schoolAccounts as SchoolAccount[]}
                    disabled={isCreatingOptionalFee}
                    valueField="account_number"
                    displayValue={(data) => `${data.account_number}`}
                  />

                  <InputComponent
                    formName="account_name"
                    formControl={form.control}
                    formLabel="Account Name"
                    formInputType="text"
                    disabled={isCreatingOptionalFee}
                    editable={true}
                  />

                  <InputComponent
                    formName="bank_name"
                    formControl={form.control}
                    formLabel="Bank Name"
                    formInputType="text"
                    disabled={isCreatingOptionalFee}
                    editable={true}
                  />
                </>
              ) : (
                <ErrorBox message="No school account available yet" />
              )}

              <div className="flex justify-center gap-6">
                <CancelButton
                  onClose={() => {
                    form.reset();
                    onClose();
                  }}
                />

                <SubmitButton
                  disabled={!form.formState.isValid || isCreatingOptionalFee}
                  loading={isCreatingOptionalFee}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
      ) : isError ? (
        <ErrorBox error={error} />
      ) : (
        <ErrorBox message="No form data found. Reload page." className="text-center" />
      )}
    </div>
  );
}
