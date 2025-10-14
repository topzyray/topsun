"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormDescription } from "@/components/ui/form";
import InputComponent from "../../base/input-component";
import { ScrollArea } from "../../../ui/scroll-area";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { ClassEnrollmentApiService } from "@/api/services/ClassEnrollmentApiService";
import { Class, Student, Subject } from "../../../../../types";
import { ComboboxComponent } from "../../base/combo-box-component";
import { CommonApiService } from "@/api/services/CommonApiServices";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SelectComponent from "@/components/forms/base/select-component";
import { TextHelper } from "@/helpers/TextHelper";
import ErrorBox from "@/components/atoms/error-box";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { DataHelper } from "@/helpers/DataHelper";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import CheckboxComponent from "../../base/checkbox-component";
import Link from "next/link";
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

export type EnrollmentData = {
  students: Student[];
  classes: Class[];
};

const AddReturningStudentsFormSchema = z.object({
  admission_number: z.string().min(1, {
    message: "Admission number required",
  }),
  student_name: z.string(),
  class_name: z.string().min(5, {
    message: "Class is required",
  }),
  level: z.string().min(1, {
    message: "Level is required",
  }),
  former_level: z.string().min(1, {
    message: "Former level is required",
  }),
  subjects_to_offer_array: z.array(z.string()).min(5, {
    message: "Subjects are required",
  }),
});

export default function AddReturningStudents({
  open,
  onClose,
  closeOnSuccess,
}: {
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();
  const { activeSessionData, classLevel } = useContext(GlobalContext);

  let levels =
    classLevel &&
    (classLevel?.data?.class_level_array.map((level) => ({
      label: level,
      value: level,
    })) as { label: string; value: string }[]);

  const form = useForm<z.infer<typeof AddReturningStudentsFormSchema>>({
    resolver: zodResolver(AddReturningStudentsFormSchema),
    defaultValues: {
      admission_number: "",
      student_name: "",
      class_name: "",
      level: "",
      former_level: "JSS 1",
      subjects_to_offer_array: [],
    },
  });

  const former_level = form.watch("former_level");
  const class_data = form.watch("class_name");

  const { data, isLoading, isError, error } = useCustomQuery(
    ["student_class_returning_enrollment", former_level],
    () =>
      CommonApiService.getStudentClassReturningStudents({
        level: former_level,
      }),
    { id: former_level },
  );

  let enrollmentData: EnrollmentData | null = data !== undefined ? data : null;

  let { mutate: enrolStudentToClass, isPending: isEnrolling } = useCustomMutation(
    ClassEnrollmentApiService.enrollStudentToClassInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["enrollments"] });
        queryClient.invalidateQueries({ queryKey: ["enrollmentById"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  const newLevel = DataHelper.processNewClassLevel(former_level);
  const nextClasses = enrollmentData?.classes.filter((item) => item.level === newLevel) ?? [];

  async function onSubmit(data: z.infer<typeof AddReturningStudentsFormSchema>) {
    const subjectIds = DataHelper.getMatchingValues(
      classSubjectData,
      data.subjects_to_offer_array,
      (source, compare) => source.name === compare,
      (source) => source._id,
    );

    const student = enrollmentData?.students.find(
      (item) => item.admission_number === data.admission_number,
    );

    const selectedClass = nextClasses.find((item) => item.name === data.class_name);

    if (!student || !selectedClass) {
      console.error("Invalid student or class selection.");
      return;
    }

    const processed_data = {
      ...data,
      student_id: student._id,
      class_id: selectedClass._id,
      academic_session_id: activeSessionData?.activeSession?._id ?? "",
      term: activeSessionData?.activeTerm?.name ?? "",
      subjects_to_offer_array: subjectIds,
    };

    enrolStudentToClass(processed_data);
  }

  const admission_number = form.watch("admission_number");

  useEffect(() => {
    if (admission_number) {
      form.setValue(
        "student_name",
        `${
          enrollmentData?.students
            .filter((item: Student) => item.admission_number == admission_number)
            .map((item: Student) => TextHelper.capitalize(item.first_name))[0] as string
        } ${
          enrollmentData?.students
            .filter((item: Student) => item.admission_number == admission_number)
            .map((item: Student) => TextHelper.capitalize(item.last_name))[0] as string
        }`,
      );
    }
  }, [admission_number, form, enrollmentData?.students]);

  useEffect(() => {
    if (class_data) {
      form.setValue("level", class_data.slice(0, class_data.length - 1));
    }
  }, [class_data, form]);

  const class_id = enrollmentData?.classes
    .filter((item: Class) => item.name == class_data)
    .map((item: Class) => item._id)[0] as string;

  let {
    data: classSubjects,
    isLoading: isLoadingClassSubjects,
    isError: isClassSubjectError,
    error: classSubjectError,
  } = useCustomQuery(
    ["class_subjects"],
    async () => await SubjectApiService.getAllClassSubjectsByClassId(class_id),
    { id: class_id },
    class_id !== undefined,
  );

  let classSubjectData: Subject[] =
    (classSubjects?.class_subjects !== undefined && classSubjects?.class_subjects) ?? [];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        {isLoading ? (
          <CircularLoader text="Loading form data" />
        ) : enrollmentData != null ? (
          <ScrollArea className="h-full max-h-[80vh]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="uppercase">Select enrollment details</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>

                <Separator />

                <SelectComponent
                  formName="former_level"
                  formControl={form.control}
                  formLabel="Former Level"
                  formPlaceholder=""
                  formOptionLabel="Select class"
                  formOptionData={levels}
                  disabled={isEnrolling}
                />

                {nextClasses?.length > 0 ? (
                  <>
                    <ComboboxComponent
                      formName="class_name"
                      formControl={form.control}
                      formLabel="New Class"
                      formPlaceholder=""
                      formOptionLabel="Select class"
                      formOptionData={nextClasses as Class[]}
                      disabled={isEnrolling}
                      valueField="name"
                      displayValue={(data) => `${data.name}`}
                    />

                    <InputComponent
                      formName="level"
                      formControl={form.control}
                      formLabel="New Level"
                      formPlaceholder=""
                      disabled={isEnrolling}
                      formInputType="text"
                      readOnly={true}
                    />

                    <ComboboxComponent
                      formName="admission_number"
                      formControl={form.control}
                      formLabel="Student Data"
                      formPlaceholder=""
                      formOptionLabel="Select student"
                      formOptionData={enrollmentData?.students as Student[]}
                      disabled={isEnrolling}
                      valueField="admission_number"
                      displayValue={(data) =>
                        `${data.admission_number} - ${TextHelper.capitalize(
                          data.first_name,
                        )} ${TextHelper.capitalize(data.last_name)}`
                      }
                    />

                    <InputComponent
                      formName="student_name"
                      formControl={form.control}
                      formLabel="Student Email"
                      formPlaceholder=""
                      disabled={isEnrolling}
                      formInputType="text"
                      readOnly={true}
                    />
                  </>
                ) : (
                  <ErrorBox message="No student subscribed to new session yet." />
                )}

                {class_id !== undefined && (
                  <>
                    {isLoadingClassSubjects ? (
                      <CircularLoader text="Loading Class Subject Data" />
                    ) : classSubjectData && classSubjectData?.length ? (
                      <CheckboxComponent
                        formControl={form.control}
                        formName="subjects_to_offer_array"
                        formLabel="Subjects to Offer"
                        formDescription={"Select at least five (5) subjects below"}
                        formData={classSubjectData}
                        disabled={isEnrolling}
                      />
                    ) : isClassSubjectError ? (
                      <ErrorBox error={classSubjectError} />
                    ) : (
                      <FormDescription>
                        No subjects added yet.{" "}
                        <Link
                          href={`/dashboard/${userDetails?.role}/subjects`}
                          className="text-green-600 hover:underline"
                        >
                          Click here to add
                        </Link>
                      </FormDescription>
                    )}
                  </>
                )}

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
                    disabled={!form.formState.isValid || isEnrolling}
                    loading={isEnrolling}
                    text="Enroll"
                  />
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        ) : isError ? (
          <ErrorBox error={error} />
        ) : (
          <ErrorBox message="No form data found. Please reload page." />
        )}
      </DialogContent>
    </Dialog>
  );
}
