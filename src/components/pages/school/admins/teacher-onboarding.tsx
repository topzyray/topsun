"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormLabel } from "@/components/ui/form";
import { ScrollArea } from "../../../ui/scroll-area";
import { Subject } from "../../../../../types";
import { CircularLoader } from "../../../loaders/page-level-loader";
import CheckboxComponent from "../../../forms/base/checkbox-component";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { DataHelper } from "@/helpers/DataHelper";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";

const TeacherOnboardingFormSchema = z.object({
  // image: z
  //   .instanceof(File, { message: "A file is required." })
  //   .refine((file) => file.size > 0, { message: "File is required." }),
  subjects: z.array(z.string()).min(1, {
    message: "Choose at lease one subject",
  }),
});

export default function TeacherOnboardingForm({
  teacher_id,
  onClose,
  closeOnSuccess,
}: {
  teacher_id: string;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  let { data, isLoading, isError, error } = useCustomQuery(
    ["subjects"],
    SubjectApiService.getAllSubjects,
  );

  let allSubjects: Subject[] = data?.subjects !== undefined && data?.subjects;

  const form = useForm<z.infer<typeof TeacherOnboardingFormSchema>>({
    resolver: zodResolver(TeacherOnboardingFormSchema),
    defaultValues: {
      subjects: [],
      // image: undefined,
    },
  });

  let { mutate: onboardTeacher, isPending: isOnboardingTeacher } = useCustomMutation(
    TeacherApiService.onboardTeacherById,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["teacherById"] });
        queryClient.invalidateQueries({ queryKey: [teacher_id] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof TeacherOnboardingFormSchema>) {
    const subjectIds = DataHelper.getMatchingValues(
      allSubjects,
      data.subjects,
      (source, compare) => source.name === compare,
      (source) => source._id,
    );

    onboardTeacher({
      requestBody: {
        subject_ids: subjectIds,
      },
      params: {
        teacher_id,
      },
    });
  }

  // const image_data = form.watch("image");

  return (
    <div className="bg-background w-full max-w-[28rem] rounded">
      {isLoading && allSubjects.length === 0 && <CircularLoader text="Loading form data" />}
      {!isLoading && allSubjects.length > 0 && (
        <ScrollArea className="h-full max-h-[80vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
            >
              <FormLabel className="text-center text-lg uppercase">
                Teacher Profile Onboarding Form
              </FormLabel>

              {/* <ImageComponent
                formName="image"
                formControl={form.control}
                formLabel="Profle Image"
                disabled={isOnboardingTeacher}
              />

              {image_data === undefined || !(image_data instanceof File) ? (
                <FormLabel>No image</FormLabel>
              ) : (
                <div>
                  <div className="w-20 h-20">
                    <img
                      src={URL.createObjectURL(image_data)}
                      alt="Image preview"
                      className="w-full h-full rounded-full"
                    />
                  </div>
                </div>
              )} */}

              <CheckboxComponent
                formControl={form.control}
                formName="subjects"
                formLabel="Subjects To Teach"
                formDescription={"Mininum of one (1)"}
                formData={allSubjects}
                disabled={isOnboardingTeacher}
              />

              <div className="flex justify-center gap-6">
                <CancelButton onClose={onClose} />
                <SubmitButton
                  type="submit"
                  disabled={!form.formState.isValid || isOnboardingTeacher}
                  loading={isOnboardingTeacher}
                />
              </div>
            </form>
          </Form>
        </ScrollArea>
      )}
      {isError && <p className="text-red-600">{extractErrorMessage(error)}</p>}
    </div>
  );
}
