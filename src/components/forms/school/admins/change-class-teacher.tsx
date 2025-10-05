"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form } from "@/components/ui/form";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import { Class, Teacher } from "../../../../../types";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { ComboboxComponent } from "../../base/combo-box-component";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import ErrorBox from "@/components/atoms/error-box";
import CancelButton from "@/components/buttons/CancelButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import { ClassApiService } from "@/api/services/ClassApiService";
import InputComponent from "../../base/input-component";
import { useEffect } from "react";
import { TextHelper } from "@/helpers/TextHelper";

const ChangeClassTeacherFormSchema = z.object({
  class: z.string(),
  teacherEmail: z.string(),
  teacherFirstName: z.string(),
  teacherLastName: z.string(),
});

export default function ChangeClassTeacher({
  action_from,
  onClose,
  closeOnSuccess,
  teacher_id,
  class_id,
}: {
  action_from: "class" | "teacher";
  onClose: () => void;
  closeOnSuccess: () => void;
  teacher_id?: string;
  class_id?: string;
}) {
  const queryClient = useQueryClient();

  let {
    data: classApiData,
    isLoading: isLoadingClassApiData,
    isError: isClassApiDataError,
    error: classApiDataError,
  } = useCustomQuery(["classes"], ClassApiService.getAllClasses, {}, action_from === "teacher");

  let classData: Class[] = classApiData?.classes !== undefined && classApiData?.classes;

  let {
    data: teacherApiData,
    isLoading: isLoadingTeacherApiData,
    isError: isTeacherApiDataError,
    error: teacherApiDataError,
  } = useCustomQuery(
    ["teachers"],
    TeacherApiService.getTeachers,
    undefined,
    action_from === "class",
  );

  let teacherData: Teacher[] =
    teacherApiData?.teachers?.teacherObj !== undefined && teacherApiData?.teachers?.teacherObj;

  const form = useForm<z.infer<typeof ChangeClassTeacherFormSchema>>({
    resolver: zodResolver(ChangeClassTeacherFormSchema),
    defaultValues: {
      class: "",
      teacherEmail: "",
      teacherFirstName: "",
      teacherLastName: "",
    },
  });

  let { mutate: changeClassTeacher, isPending: isAssignTeacherToClass } = useCustomMutation(
    TeacherApiService.changeClassTeacher,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["teachers"] });
        queryClient.invalidateQueries({ queryKey: ["teacherById"] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof ChangeClassTeacherFormSchema>) {
    if (action_from === "class") {
      changeClassTeacher({
        requestBody: {
          new_class_teacher_id: teacherData.filter((item) => item?.email === data?.teacherEmail)[0]
            ?._id,
        },
        params: {
          class_id: class_id as string,
        },
      });
    } else if (action_from === "teacher") {
      changeClassTeacher({
        requestBody: {
          new_class_teacher_id: teacher_id as string,
        },
        params: {
          class_id: classData.filter((item) => item?.name === data?.class)[0]?._id,
        },
      });
    }
  }

  const nameOfClass = form.watch("class");
  const teacherEmail = form.watch("teacherEmail");

  useEffect(() => {
    if (action_from === "class" && teacherEmail) {
      teacherData &&
        teacherData.length > 0 &&
        teacherData.map((teacher) => {
          form.setValue("teacherFirstName", TextHelper.capitalize(teacher?.first_name));
          form.setValue("teacherLastName", TextHelper.capitalize(teacher?.last_name));
        });
    }
  }, [teacherEmail, teacherData, form, action_from]);

  return (
    <div className="bg-background w-full rounded">
      {isLoadingClassApiData || isLoadingTeacherApiData ? (
        <CircularLoader text="Loading form data" />
      ) : classData !== undefined || teacherData !== undefined ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
          >
            <h2 className="text-center text-lg uppercase">
              {action_from === "class" && "Change Class Teacher"}
              {action_from === "teacher" && "Change Class Managing"}
            </h2>

            {action_from && action_from === "teacher" && classData && classData.length > 0 && (
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
            )}

            {action_from && action_from === "class" && teacherData && teacherData.length > 0 && (
              <>
                <ComboboxComponent
                  formName="teacherEmail"
                  formControl={form.control}
                  formLabel="Teacher Email"
                  formPlaceholder="Search teacher email"
                  formOptionLabel="Select teacher email"
                  formOptionData={teacherData}
                  disabled={isAssignTeacherToClass}
                  valueField="email"
                  displayValue={(data) => `${data.email}`}
                />

                <InputComponent
                  formName="teacherFirstName"
                  formControl={form.control}
                  formLabel="Teacher First Name"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isAssignTeacherToClass}
                  editable={true}
                />

                <InputComponent
                  formName="teacherLastName"
                  formControl={form.control}
                  formLabel="Teacher Last Name"
                  formInputType="text"
                  formPlaceholder=""
                  disabled={isAssignTeacherToClass}
                  editable={true}
                />
              </>
            )}

            <div className="flex justify-center gap-2">
              <CancelButton onClose={onClose} />

              <SubmitButton
                disabled={
                  (action_from === "teacher" && nameOfClass.length <= 0) ||
                  (action_from === "class" && teacherEmail.length <= 0) ||
                  isAssignTeacherToClass
                }
                loading={isAssignTeacherToClass}
                text="Change"
              />
            </div>
          </form>
        </Form>
      ) : isClassApiDataError || isTeacherApiDataError ? (
        <>
          {isClassApiDataError && <ErrorBox error={classApiDataError} />}
          {isTeacherApiDataError && <ErrorBox error={teacherApiDataError} />}
        </>
      ) : (
        <ErrorBox message="No form data found. Please reload page." />
      )}
    </div>
  );
}
