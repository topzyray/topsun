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
import { TextHelper } from "@/helpers/TextHelper";
import ErrorBox from "@/components/atoms/error-box";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import CheckboxComponent from "../../base/checkbox-component";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import Link from "next/link";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { DataHelper } from "@/helpers/DataHelper";
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
import toast from "react-hot-toast";

export type EnrollmentData = {
  students: {
    students: Student[];
  };
  classes: {
    classes: Class[];
  };
};

const AddNewEnrollmentFormSchema = z.object({
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
  subjects_to_offer_array: z.array(z.string()).min(5, {
    message: "Subjects are required",
  }),
});

export default function AddNewEnrollment({
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

  const classLevelArray =
    classLevel?.data?.class_level_array &&
    classLevel?.data?.class_level_array.length &&
    classLevel?.data?.class_level_array.map((level: string) => ({
      level,
    }));

  const { data, isLoading, isError, error } = useCustomQuery(
    ["student_class_new_enrollment"],
    CommonApiService.getStudentClassNewStudents,
  );

  let enrollmentData: EnrollmentData | null = data !== undefined ? data : null;

  const form = useForm<z.infer<typeof AddNewEnrollmentFormSchema>>({
    resolver: zodResolver(AddNewEnrollmentFormSchema),
    defaultValues: {
      admission_number: "",
      student_name: "",
      class_name: "",
      level: "",
      subjects_to_offer_array: [],
    },
  });

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

  async function onSubmit(data: z.infer<typeof AddNewEnrollmentFormSchema>) {
    if (!activeSessionData?.activeTerm?.name) {
      toast.error("Please create a term to proceed!");
      return;
    }
    const subjectIds = DataHelper.getMatchingValues(
      classSubjectData,
      data.subjects_to_offer_array,
      (source, compare) => source.name === compare,
      (source) => source._id,
    );

    const processed_data = {
      level: data?.level,
      student_id: enrollmentData?.students?.students.find(
        (item: Student) => item.admission_number == data.admission_number,
      )?._id as string,
      class_id: enrollmentData?.classes?.classes.find((item: Class) => item.name == data.class_name)
        ?._id as string,
      academic_session_id: activeSessionData?.activeSession?._id as string,
      term: activeSessionData?.activeTerm?.name as string,
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
          enrollmentData?.students?.students
            .filter((item: Student) => item.admission_number == admission_number)
            .map((item: Student) => TextHelper.capitalize(item.first_name))[0] as string
        } ${
          enrollmentData?.students?.students
            .filter((item: Student) => item.admission_number == admission_number)
            .map((item: Student) => TextHelper.capitalize(item.last_name))[0] as string
        }`,
      );
    }
  }, [admission_number, form, enrollmentData?.students?.students]);

  const class_data = form.watch("class_name");

  useEffect(() => {
    if (class_data) {
      form.setValue("level", class_data.slice(0, class_data.length - 1));
    }
  }, [class_data, form]);

  const class_id = enrollmentData?.classes?.classes
    .filter((item: Class) => item.name == class_data)
    .map((item: Class) => item._id)[0] as string;

  // Fetch subject for a class
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
                  <DialogTitle className="uppercase">New Students Enrollment Form</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>

                <Separator />

                <ComboboxComponent
                  formName="class_name"
                  formControl={form.control}
                  formLabel="Class Data"
                  formPlaceholder=""
                  formOptionLabel="Select class"
                  formOptionData={enrollmentData?.classes?.classes as Class[]}
                  disabled={isEnrolling}
                  valueField="name"
                  displayValue={(data) => `${data.name}`}
                />

                {classLevel?.loading ? (
                  <CircularLoader text="Loading class level" />
                ) : classLevelArray && classLevelArray.length > 0 ? (
                  <ComboboxComponent
                    formName="level"
                    formControl={form.control}
                    formLabel="Class Level"
                    formPlaceholder=""
                    formOptionLabel="Select class level"
                    formOptionData={classLevelArray}
                    disabled={isEnrolling}
                    displayValue={(data) => data.level}
                    valueField="level"
                  />
                ) : classLevel?.error ? (
                  <ErrorBox error={classLevel?.error} />
                ) : (
                  "Please create class level"
                )}

                <ComboboxComponent
                  formName="admission_number"
                  formControl={form.control}
                  formLabel="Student Data"
                  formPlaceholder=""
                  formOptionLabel="Select student"
                  formOptionData={enrollmentData?.students?.students as Student[]}
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
