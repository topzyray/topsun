"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";
import { SuperAdminApiService } from "@/api/services/SuperAdminApiService";
import CancelButton from "@/components/buttons/CancelButton";
import { TagInputComponent } from "../../base/tag-input-component";
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

interface AddClassLevelForSchoolForm {
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}

const formSchema = z.object({
  class_level_array: z.array(z.string().min(1, { message: "Cannot be empty" })),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddClassLevelForSchoolForm({
  open,
  onClose,
  closeOnSuccess,
}: AddClassLevelForSchoolForm) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_level_array: [],
    },
  });

  const { mutate: createPaymentPriority, isPending: isCreatingClassLevel } = useCustomMutation(
    SuperAdminApiService.createClassLevels,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["schools"] });
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["class_level"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    createPaymentPriority({
      requestBody: data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="uppercase">Add Class Level Form</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>

            <Separator />

            <TagInputComponent
              formControl={form.control}
              formName="class_level_array"
              formLabel="Class Level"
              formPlaceholder="Add class level"
              enableSuggestions
              suggestions={["JSS 1", "JSS 2", "JSS 3", "SSS 1", "SSS 2", "SSS 3"]}
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
                loading={isCreatingClassLevel}
                type="submit"
                disabled={isCreatingClassLevel || !form.formState.isValid}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
