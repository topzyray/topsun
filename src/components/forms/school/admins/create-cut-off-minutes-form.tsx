"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";
import CancelButton from "@/components/buttons/CancelButton";
import { CbtApiService } from "@/api/services/CbtApiService";
import InputComponent from "../../base/input-component";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface ICreateCutOffMinutesForSchoolForm {
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}

const formSchema = z.object({
  first_cutoff_minutes: z.coerce.number().min(1, {
    message: "First cutoff minutes required",
  }),
  last_cutoff_minutes: z.coerce.number().min(1, {
    message: "Second cutoff minutes required",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCutOffMinutesForSchoolForm({
  open,
  onClose,
  closeOnSuccess,
}: ICreateCutOffMinutesForSchoolForm) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_cutoff_minutes: 0,
      last_cutoff_minutes: 0,
    },
  });

  const { mutate: createCutoffMinutes, isPending: isCreatingCutoffMinutes } = useCustomMutation(
    CbtApiService.createCutoffMinutesForASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["schools"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    createCutoffMinutes({
      requestBody: data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="uppercase">Assessment time cutoff minutes form</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>

            <Separator />

            <InputComponent
              formControl={form.control}
              formName="first_cutoff_minutes"
              formLabel="First Cutoff Minutes"
              formInputType="number"
              disabled={isCreatingCutoffMinutes}
            />

            <InputComponent
              formControl={form.control}
              formName="last_cutoff_minutes"
              formLabel="Last Cutoff Minutes"
              formInputType="number"
              disabled={isCreatingCutoffMinutes}
            />

            <DialogFooter>
              <DialogClose asChild>
                <CancelButton
                  onClose={() => {
                    form.reset();
                    onClose();
                  }}
                />
              </DialogClose>
              <SubmitButton
                loading={isCreatingCutoffMinutes}
                type="submit"
                disabled={isCreatingCutoffMinutes || !form.formState.isValid}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
