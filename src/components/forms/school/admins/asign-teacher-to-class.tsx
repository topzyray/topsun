"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import { Class } from "../../../../../types";
import { ClassApiService } from "@/api/services/ClassApiService";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { ComboboxComponent } from "../../base/combo-box-component";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import ErrorBox from "@/components/atoms/error-box";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";

const AssignTeacherToClassFormSchema = z.object({
  class: z.string().min(6, {
    message: "Class Data is required",
  }),
});

export default function AssignTeacherToClass({
  onClose,
  closeOnSuccess,
  teacher_id,
}: {
  onClose: () => void;
  closeOnSuccess: () => void;
  teacher_id: string;
}) {
  const queryClient = useQueryClient();

  let { data, isLoading, isError, error } = useCustomQuery(
    ["classes"],
    ClassApiService.getAllClasses,
  );

  let classData: Class[] = data?.classes !== undefined && data?.classes;

  const form = useForm<z.infer<typeof AssignTeacherToClassFormSchema>>({
    resolver: zodResolver(AssignTeacherToClassFormSchema),
    defaultValues: {
      class: "",
    },
  });

  let { mutate: assignTeacherToClass, isPending: isAssignTeacherToClass } = useCustomMutation(
    TeacherApiService.assignTeacherToClass,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["teacherById"] });
        queryClient.invalidateQueries({ queryKey: [teacher_id] });
        queryClient.invalidateQueries({ queryKey: ["class_managing"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof AssignTeacherToClassFormSchema>) {
    const processed_data = {
      teacher_id,
      class_id: classData.filter((item) => item.name === data.class)[0]._id,
    };

    assignTeacherToClass(processed_data);
  }

  return (
    <div className="bg-background w-full rounded">
      {isLoading ? (
        <CircularLoader text="Loading form data" />
      ) : classData !== undefined && classData.length ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
          >
            <h2 className="text-center text-lg uppercase">Teacher Class Assignment Form</h2>

            <ComboboxComponent
              formName="class"
              formControl={form.control}
              formLabel="Class Data"
              formPlaceholder="Search class data"
              formOptionLabel="Select class"
              formOptionData={classData}
              disabled={isAssignTeacherToClass}
              valueField="name"
              displayValue={(data) => `${data.name}`}
            />

            <div className="flex justify-center gap-2">
              <CancelButton onClose={onClose} />

              <SubmitButton
                disabled={!form.formState.isValid || isAssignTeacherToClass}
                loading={isAssignTeacherToClass}
                text="Assign"
              />
            </div>
          </form>
        </Form>
      ) : isError ? (
        <ErrorBox error={error} />
      ) : (
        <ErrorBox message="No form data found. Please reload page." />
      )}
    </div>
  );
}
