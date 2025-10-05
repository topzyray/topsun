"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { ClassExamTimetable, Student, Subject, Teacher } from "../../../../types";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import ErrorBox from "@/components/atoms/error-box";
import { CbtApiService } from "@/api/services/CbtApiService";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { ComboboxComponent } from "../base/combo-box-component";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { TextHelper } from "@/helpers/TextHelper";
import InputComponent from "../base/input-component";

const AuthorizeStartExamFormSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  start_date: z.string(),
  start_time: z.string(),
});

export default function AuthorizeStudentToStartExamForm({
  onClose,
  closeOnSuccess,
  class_id,
  student_data,
}: {
  onClose: () => void;
  closeOnSuccess: () => void;
  class_id: string;
  student_data: any;
}) {
  const { activeSessionData } = useContext(GlobalContext);
  const { userDetails } = useAuth();
  const teacher = (userDetails as Teacher) ?? {};
  const queryClient = useQueryClient();

  let {
    data,
    isLoading: isLoadingClassSubjects,
    isError: isClassSubjectError,
    error: classSubjectError,
  } = useCustomQuery(
    ["timetable"],
    () =>
      CbtApiService.getTermClassExamTimetable({
        academic_session_id: activeSessionData?.activeSession?._id as string,
        class_id: teacher?.class_managing?._id,
        term: activeSessionData?.activeTerm?.name as string,
      }),
    {},
    activeSessionData?.activeSession?._id !== undefined ||
      activeSessionData?.activeTerm?.name !== undefined,
  );

  const classTimetable: ClassExamTimetable = data?.timetable != undefined && data?.timetable;
  data = data?.timetable != undefined && data?.timetable;

  let scheduled_subjects =
    classTimetable?.scheduled_subjects !== undefined &&
    classTimetable?.scheduled_subjects.length &&
    classTimetable?.scheduled_subjects;

  let classSubjectData =
    scheduled_subjects &&
    scheduled_subjects.length &&
    (scheduled_subjects.map((item) => item?.subject_id) as Subject[]);

  const form = useForm<z.infer<typeof AuthorizeStartExamFormSchema>>({
    resolver: zodResolver(AuthorizeStartExamFormSchema),
    defaultValues: {
      subject: "",
      start_date: "",
      start_time: "",
    },
  });

  const { mutate: authorizeStudentsToStartExam, isPending: isAuthorizingStudentsToStartExam } =
    useCustomMutation(CbtApiService.classTeacherAuthorizeStudentsToWriteSubjectCbtInASchool, {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["timetable"] });
        form.reset();
        closeOnSuccess();
      },
    });

  async function onSubmit(data: z.infer<typeof AuthorizeStartExamFormSchema>) {
    const studentIds =
      student_data &&
      student_data.length > 0 &&
      student_data.map((student: Student) => student._id);

    const subjectId =
      classSubjectData &&
      classSubjectData.length &&
      classSubjectData.filter((subject) => subject?.name === data?.subject)[0]?._id;

    authorizeStudentsToStartExam({
      requestBody: {
        students_id_array: studentIds,
        term: activeSessionData?.activeTerm?.name as string,
      },
      params: {
        subject_id: subjectId as string,
        academic_session_id: activeSessionData?.activeSession?._id as string,
        class_id,
      },
    });
  }

  const subject = form.watch("subject");

  useEffect(() => {
    if (subject !== undefined) {
      scheduled_subjects &&
        scheduled_subjects.length &&
        scheduled_subjects.forEach((timetable) => {
          if (subject === timetable?.subject_id?.name) {
            form.setValue("start_date", TextHelper.getFormattedDate(timetable?.start_time));
            form.setValue("start_time", TextHelper.getFormattedTime(timetable?.start_time));
          }
        });
    }
  }, [form, scheduled_subjects, subject]);

  return (
    <div className="bg-background w-full rounded">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
        >
          <h2 className="text-center text-lg uppercase">Select Exam to Start</h2>

          {isLoadingClassSubjects ? (
            <CircularLoader text="Loading subject data" />
          ) : classSubjectData && classSubjectData.length ? (
            <>
              <ComboboxComponent
                formName={`subject`}
                formControl={form.control}
                formLabel="Subject Data"
                formPlaceholder=""
                formOptionLabel="Select subject"
                formOptionData={classSubjectData}
                disabled={isAuthorizingStudentsToStartExam}
                valueField="name"
                displayValue={(data) => `${data?.name}`}
              />

              <InputComponent
                formName={`start_date`}
                formControl={form.control}
                formLabel="Start Date"
                formPlaceholder=""
                disabled={isAuthorizingStudentsToStartExam}
                formInputType="text"
                editable
              />
              <InputComponent
                formName={`start_time`}
                formControl={form.control}
                formLabel="Start Time"
                formPlaceholder=""
                disabled={isAuthorizingStudentsToStartExam}
                formInputType="text"
                editable
              />
            </>
          ) : isClassSubjectError ? (
            <ErrorBox error={classSubjectError} />
          ) : null}

          <div className="flex justify-center gap-6">
            <CancelButton onClose={onClose} />

            <SubmitButton
              disabled={!form.formState.isValid || isAuthorizingStudentsToStartExam}
              loading={isAuthorizingStudentsToStartExam}
              text="Authorize"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
