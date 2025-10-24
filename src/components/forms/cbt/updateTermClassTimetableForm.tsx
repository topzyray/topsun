"use client";

import { z } from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CbtApiService } from "@/api/services/CbtApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import InputComponent from "../base/input-component";
import {
  Dialog,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScheduledTimetableSubject } from "../../../../types";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { TextHelper } from "@/helpers/TextHelper";
import { Separator } from "@/components/ui/separator";

const UpdateTermClassTimetableFormSchema = z.object({
  subject: z.string(),
  start_time: z.string(),
  start_date: z.string(),
  new_time: z.string(),
});

export function UpdateTermClassTimetableForm({
  trigger,
  onSuccess,
  initialData,
}: {
  trigger?: React.ReactNode;
  onSuccess: () => void;
  initialData: ScheduledTimetableSubject;
}) {
  const [openForm, setOpenForm] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof UpdateTermClassTimetableFormSchema>>({
    resolver: zodResolver(UpdateTermClassTimetableFormSchema),
    defaultValues: {
      subject: "",
      start_time: "",
      start_date: "",
      new_time: "",
    },
  });

  const { mutate: updateTimetable, isPending: isUpdatingTimetable } = useCustomMutation(
    CbtApiService.updateClassCbtTimetable,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["timetable"] });
        setOpenForm(false);
        form.reset();
        onSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof UpdateTermClassTimetableFormSchema>) {
    updateTimetable({
      requestBody: {
        selected_time: TextHelper.dateInputToUTC(data.new_time),
      },
      params: {
        subject_id: initialData.subject_id?._id,
        timetable_id: initialData.timetable_id,
      },
    });
  }

  useEffect(() => {
    if (initialData) {
      form.reset({
        subject: TextHelper.capitalizeWords(initialData.subject_id?.name) ?? "",
        start_time: TextHelper.getFormattedTime(initialData.start_time) ?? "",
        start_date: TextHelper.getFormattedDate(initialData.start_time) ?? "",
      });
    }
  }, [form, initialData]);

  return (
    <Dialog open={openForm} onOpenChange={setOpenForm}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" onClick={() => setOpenForm(true)}>
            <Edit size={16} />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <p className="uppercase">Update assessment start time</p>
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <InputComponent
                formName={`subject`}
                formControl={form.control}
                formLabel="Subject"
                formPlaceholder=""
                disabled={isUpdatingTimetable}
                formInputType="text"
                readOnly
              />
              <InputComponent
                formName={`start_date`}
                formControl={form.control}
                formLabel="Current Start Date"
                formPlaceholder=""
                disabled={isUpdatingTimetable}
                formInputType="text"
                readOnly
              />
              <InputComponent
                formName={`start_time`}
                formControl={form.control}
                formLabel="Current Start Time"
                formPlaceholder=""
                disabled={isUpdatingTimetable}
                formInputType="text"
                readOnly
              />
              <InputComponent
                formName={`new_time`}
                formControl={form.control}
                formInputType="datetime-local"
                formLabel="New Date & Start Time"
                formPlaceholder=""
                disabled={isUpdatingTimetable}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <CancelButton onClose={() => setOpenForm(false)} />
                </DialogClose>
                <SubmitButton
                  disabled={!form.formState.isValid || isUpdatingTimetable}
                  loading={isUpdatingTimetable}
                  text="Update Record"
                />
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
