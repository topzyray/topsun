"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
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

const AddNewSubjectFormSchema = z.object({
  name: z.string().min(1, {
    message: "Subject name is required",
  }),
  description: z.string().min(3, {
    message: "Subject description is required",
  }),
});

export default function CreateNewSubject({
  open,
  onClose,
  closeOnSuccess,
}: {
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof AddNewSubjectFormSchema>>({
    resolver: zodResolver(AddNewSubjectFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  let { mutate: createSubject, isPending: isCreatingSubject } = useCustomMutation(
    SubjectApiService.createASubject,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
        queryClient.invalidateQueries({ queryKey: ["subjectById"] });
        closeOnSuccess();
        form.reset();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof AddNewSubjectFormSchema>) {
    createSubject(data);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="uppercase">Create Subject Form</DialogTitle>
            </DialogHeader>
            <DialogDescription></DialogDescription>

            <Separator />

            <InputComponent
              formName="name"
              formControl={form.control}
              formLabel="Subject Name"
              formInputType="text"
              disabled={isCreatingSubject}
            />

            <InputComponent
              formName="description"
              formControl={form.control}
              formLabel="Subject Description"
              formInputType="text"
              disabled={isCreatingSubject}
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
                type="submit"
                disabled={!form.formState.isValid || isCreatingSubject}
                loading={isCreatingSubject}
              />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
