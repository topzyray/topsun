"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { Class, Subject, Teacher } from "../../../../../types";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { ComboboxComponent } from "../../base/combo-box-component";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import { CommonApiService } from "@/api/services/CommonApiServices";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import ErrorBox from "@/components/atoms/error-box";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { TextHelper } from "@/helpers/TextHelper";

type FormFieldDataType = {
  subjects: Class[] | [];
  classes: Subject[] | [];
};

const AssignTeacherToSubjectFormSchema = z.object({
  subject: z.string().min(1, {
    message: "Subject is required",
  }),
  class: z.string().min(1, {
    message: "Class is required",
  }),
});

export default function AssignTeacherToSubject({
  onClose,
  closeOnSuccess,
  teacher_data,
}: {
  onClose: () => void;
  closeOnSuccess: () => void;
  teacher_data: Teacher;
}) {
  const queryClient = useQueryClient();

  let { data, isLoading, isError, error } = useCustomQuery(
    ["classes_subjects"],
    CommonApiService.getClassesAndSubjects,
  );

  let formFieldData: FormFieldDataType | null = data !== undefined ? data : null;

  const form = useForm<z.infer<typeof AssignTeacherToSubjectFormSchema>>({
    resolver: zodResolver(AssignTeacherToSubjectFormSchema),
    defaultValues: {
      class: "",
    },
  });

  let { mutate: assignTeacherToSubject, isPending: isAssignTeacherToSubject } = useCustomMutation(
    TeacherApiService.assignTeacherToSubjectInSchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["teacherById"] });
        queryClient.invalidateQueries({ queryKey: [teacher_data._id] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof AssignTeacherToSubjectFormSchema>) {
    const processed_data = {
      ...data,
      teacher_id: teacher_data._id,
      class_id: formFieldData?.classes.filter((item) => item.name === data.class)[0]._id as string,
    };

    assignTeacherToSubject(processed_data);
  }

  return (
    <div className="bg-background w-full rounded">
      {isLoading ? (
        <CircularLoader text="Loading form data" />
      ) : formFieldData !== null ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
          >
            <h2 className="text-center text-lg uppercase">Teacher Subject Assignment Form</h2>

            <ComboboxComponent
              formName="class"
              formControl={form.control}
              formLabel="Class Data"
              formPlaceholder="Search class data"
              formOptionLabel="Select class"
              formOptionData={formFieldData.classes}
              disabled={isAssignTeacherToSubject}
              valueField="name"
              displayValue={(data) => `${data.name}`}
            />

            {teacher_data.subjects_capable_of_teaching &&
              teacher_data.subjects_capable_of_teaching.length > 0 && (
                <ComboboxComponent
                  formName="subject"
                  formControl={form.control}
                  formLabel="Subject Data"
                  formPlaceholder="Search subject data"
                  formOptionLabel="Select subject"
                  formOptionData={teacher_data.subjects_capable_of_teaching}
                  disabled={isAssignTeacherToSubject}
                  valueField="name"
                  displayValue={(data) => `${TextHelper.capitalize(data?.name)}`}
                />
              )}

            {teacher_data.subjects_capable_of_teaching.length === 0 && (
              <ErrorBox message="Teacher must be onboarded to continue" />
            )}

            <div className="flex justify-center gap-2">
              <CancelButton onClose={onClose} />

              <SubmitButton
                disabled={!form.formState.isValid || isAssignTeacherToSubject}
                loading={isAssignTeacherToSubject}
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
