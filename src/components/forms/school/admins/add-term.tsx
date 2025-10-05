"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { SessionApiService } from "@/api/services/SessionApiService";
import InputComponent from "../../base/input-component";
import SelectComponent from "../../base/select-component";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";

const AddNewTermFormSchema = z.object({
  start_date: z.string().min(6, {
    message: "Start date is required",
  }),
  end_date: z.string().min(6, {
    message: "End date is required",
  }),
  name: z.string().min(6, {
    message: "Term name is required",
  }),
});

export default function AddNewTerm({
  onClose,
  closeOnSuccess,
  session_id,
}: {
  onClose: () => void;
  closeOnSuccess: () => void;
  session_id: string;
}) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof AddNewTermFormSchema>>({
    resolver: zodResolver(AddNewTermFormSchema),
    defaultValues: {
      start_date: "",
      end_date: "",
      name: "",
    },
  });

  let { mutate: createTerm, isPending: isCreatingTerm } = useCustomMutation(
    SessionApiService.createTermForASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        queryClient.invalidateQueries({ queryKey: ["activeSessions"] });
        queryClient.invalidateQueries({ queryKey: ["sessionById"] });
        closeOnSuccess();
        form.reset();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof AddNewTermFormSchema>) {
    createTerm({
      requestBody: data,
      params: {
        session_id,
      },
    });
  }

  return (
    <div className="bg-background w-full max-w-[22rem] rounded">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
        >
          <h2 className="text-center text-lg uppercase">Term Creation Form</h2>

          <InputComponent
            formName="start_date"
            formControl={form.control}
            formLabel="Start Date"
            formInputType="date"
            formPlaceholder="Select start date"
            disabled={isCreatingTerm}
          />

          <InputComponent
            formName="end_date"
            formControl={form.control}
            formLabel="End Date"
            formInputType="date"
            formPlaceholder="Select end date"
            disabled={isCreatingTerm}
          />

          <SelectComponent
            formName="name"
            formControl={form.control}
            formLabel="Term Name"
            formOptionLabel="Select Term"
            formOptionData={[
              { label: "First Term", value: "first term" },
              { label: "Second Term", value: "second term" },
              { label: "Third Term", value: "third term" },
            ]}
            disabled={isCreatingTerm}
          />

          <div className="flex justify-center gap-6">
            <CancelButton onClose={onClose} />

            <SubmitButton
              disabled={!form.formState.isValid || isCreatingTerm}
              loading={isCreatingTerm}
              text="Create"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
