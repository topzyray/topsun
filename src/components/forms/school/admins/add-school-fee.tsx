"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormLabel } from "@/components/ui/form";
import { ScrollArea } from "../../../ui/scroll-area";
import { FeesApiService } from "@/api/services/FeesApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";
import CancelButton from "@/components/buttons/CancelButton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import ErrorBox from "@/components/atoms/error-box";
import { ComboboxComponent } from "../../base/combo-box-component";
import { Class, SchoolAccount } from "../../../../../types";
import { CommonApiService } from "@/api/services/CommonApiServices";
import InputComponent from "../../base/input-component";

interface AddSchoolFeeForm {
  onClose: () => void;
  closeOnSuccess: () => void;
}

const formSchema = z.object({
  fee_array: z.array(
    z.object({
      class_level: z.string().min(1),
      amount: z.coerce.number().min(0),
    }),
  ),
  account_number: z.string().min(10, {
    message: "School account is required",
  }),
  account_name: z.string(),
  bank_name: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddSchoolFeeForm({ onClose, closeOnSuccess }: AddSchoolFeeForm) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fee_array: [
        {
          class_level: "",
          amount: 0,
        },
      ],
      account_number: "",
      account_name: "",
      bank_name: "",
    },
  });

  const {
    fields: feeArrayFields,
    append: appendFee,
    remove: removeFee,
  } = useFieldArray({
    name: "fee_array",
    control: form.control,
  });

  let { data, isLoading, isError, error } = useCustomQuery(
    ["classesSchoolAccount"],
    CommonApiService.getClassAndSchoolAccount,
  );

  const classAndAccountData = {
    classData: (data?.classResponse?.classes as Class[]) ?? [],
    schoolAccounts: (data?.schoolAccountResponse?.accounts?.accounts as SchoolAccount[]) ?? [],
  };

  const levelSet = new Set(
    classAndAccountData.classData
      .map((item) => item?.level)
      .filter((level): level is string => typeof level === "string"),
  );

  const finalClassData: { level: string }[] = Array.from(levelSet).map((level) => ({
    level,
  }));

  let { mutate: createSchoolFee, isPending: isCreatingSchoolFee } = useCustomMutation(
    FeesApiService.createSchoolFeesInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["schoolFees"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: FormValues) {
    const account_id = classAndAccountData?.schoolAccounts.find(
      (account) => account?.account_number === data?.account_number,
    )?._id;

    createSchoolFee({
      fee_array: data.fee_array,
      receiving_acc_id: account_id as string,
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
              <h2 className="text-center text-lg uppercase">Add School Fee Form</h2>

              {classAndAccountData?.classData.length > 0 ? (
                <div>
                  <FormLabel className="text-lg">Class Fees</FormLabel>
                  <Card className="space-y-4 rounded-none p-4">
                    {feeArrayFields.map((field, index) => (
                      <div key={field.id} className="flex w-full flex-col flex-wrap gap-4">
                        <ComboboxComponent
                          formName={`fee_array.${index}.class_level`}
                          formControl={form.control}
                          formLabel="Class Level"
                          formPlaceholder=""
                          formOptionLabel="Select class level"
                          formOptionData={finalClassData}
                          disabled={isCreatingSchoolFee}
                          valueField="level"
                          displayValue={(data) => `${data.level}`}
                        />

                        <InputComponent
                          formControl={form.control}
                          formName={`fee_array.${index}.amount`}
                          formPlaceholder=""
                          formInputType="number"
                          formLabel="Amount"
                          disabled={isCreatingSchoolFee}
                        />

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeFee(index)}
                        >
                          Remove
                        </Button>
                        <Separator />
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() =>
                        appendFee({
                          class_level: "",
                          amount: 0,
                        })
                      }
                      disabled={isCreatingSchoolFee}
                    >
                      Add
                    </Button>
                  </Card>
                </div>
              ) : (
                <Card className="space-y-4 rounded-none p-4">
                  <p className="text-center">No class available yet</p>
                </Card>
              )}

              {classAndAccountData?.schoolAccounts.length > 0 ? (
                <div>
                  <ComboboxComponent
                    formName="account_number"
                    formControl={form.control}
                    formLabel="School Accounts"
                    formPlaceholder=""
                    formOptionLabel="Select account"
                    formOptionData={classAndAccountData?.schoolAccounts as SchoolAccount[]}
                    disabled={isCreatingSchoolFee}
                    valueField="account_number"
                    displayValue={(data) => `${data.account_number}`}
                  />

                  <InputComponent
                    formName="account_name"
                    formControl={form.control}
                    formLabel="Account Name"
                    formInputType="text"
                    disabled={isCreatingSchoolFee}
                    readOnly={true}
                  />

                  <InputComponent
                    formName="bank_name"
                    formControl={form.control}
                    formLabel="Bank Name"
                    formInputType="text"
                    disabled={isCreatingSchoolFee}
                    readOnly={true}
                  />
                </div>
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

                <SubmitButton
                  disabled={!form.formState.isValid || isCreatingSchoolFee}
                  loading={isCreatingSchoolFee}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
      ) : isError ? (
        <ErrorBox error={error} />
      ) : (
        <ErrorBox
          message="No class data found. Create class to continue."
          className="text-center"
        />
      )}
    </div>
  );
}
