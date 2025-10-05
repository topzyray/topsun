"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormLabel } from "@/components/ui/form";
import InputComponent from "../../base/input-component";
import { ScrollArea } from "../../../ui/scroll-area";
import { FeesApiService } from "@/api/services/FeesApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";

const UpdateSchoolFeeFormSchema = z.object({
  amount: z.string().min(1, {
    message: "Amount is required",
  }),
});

export default function UpdateSchoolFee({
  fee,
  onClose,
  closeOnSuccess,
}: {
  fee: any;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const form = useForm<z.infer<typeof UpdateSchoolFeeFormSchema>>({
    resolver: zodResolver(UpdateSchoolFeeFormSchema),
    defaultValues: {
      amount: fee.school_fees.toString(),
    },
  });

  useEffect(() => {
    if (fee !== null || fee !== undefined) {
      form.setValue("amount", fee.school_fees.toString());
    }
  }, [fee, form]);

  const queryClient = useQueryClient();

  const { mutate: updateSchoolFee, isPending: isUpdatingSchoolFee } = useCustomMutation(
    FeesApiService.updateSchoolFeeById,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["schoolFees"] });
        queryClient.invalidateQueries({ queryKey: ["schoolFeeById"] });
        queryClient.invalidateQueries({ queryKey: [fee._id] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof UpdateSchoolFeeFormSchema>) {
    updateSchoolFee({
      formData: { ...data },
      params: {
        fee_id: fee._id,
      },
    });
  }

  return (
    <div className="bg-background w-full max-w-[28rem] rounded">
      <ScrollArea className="h-full max-h-[80vh]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
          >
            <FormLabel className="text-center text-lg uppercase">School fee update form</FormLabel>

            <InputComponent
              formName="amount"
              formControl={form.control}
              formLabel="Enter amount"
              formInputType="text"
              formPlaceholder="₦"
              disabled={isUpdatingSchoolFee}
            />

            <div className="flex justify-center gap-6">
              <CancelButton
                onClose={() => {
                  form.reset();
                  onClose();
                }}
              />

              <SubmitButton
                disabled={!form.formState.isValid || isUpdatingSchoolFee}
                loading={isUpdatingSchoolFee}
                text="Update"
              />
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}
