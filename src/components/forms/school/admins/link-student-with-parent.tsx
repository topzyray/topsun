"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormLabel } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { Parent, Student } from "../../../../../types";
import { StudentApiService } from "@/api/services/StudentApiService";
import { ComboboxComponent } from "../../base/combo-box-component";
import { ParentApiService } from "@/api/services/ParentApiService";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import InputComponent from "@/components/forms/base/input-component";
import { TextHelper } from "@/helpers/TextHelper";
import SubmitButton from "@/components/buttons/SubmitButton";
import CancelButton from "@/components/buttons/CancelButton";
import ErrorBox from "@/components/atoms/error-box";

const LinkStudentWithParentFormSchema = z.object({
  admission_number: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  parent: z.string(),
});

export default function LinkStudentWithParent({
  action_from,
  student_data,
  parent_data,
  onClose,
  closeOnSuccess,
}: {
  action_from: "student" | "parent";
  student_data?: Student;
  parent_data?: Parent;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const queryClient = useQueryClient();

  const {
    data: parentData,
    isLoading: isLoadingParentData,
    isError: isParentError,
    error: parentError,
  } = useCustomQuery(
    ["parents"],
    ParentApiService.getAllParentsInSchool,
    {},
    action_from === "student",
  );

  const parentArr = parentData?.parents?.parentObj !== undefined && parentData?.parents?.parentObj;

  const {
    data: studentData,
    isLoading: isLoadingStudentData,
    isError: isStudentError,
    error: studentError,
  } = useCustomQuery(
    ["students"],
    StudentApiService.getAllStudentInASchool,
    {},
    action_from === "parent",
  );

  const studentArr =
    studentData?.students?.studentObj !== undefined ? studentData?.students?.studentObj : [];

  const formFieldData: {
    parentData: Parent[] | [];
    studentData: Student[] | [];
  } = {
    parentData: [],
    studentData: [],
  };

  if (action_from === "student") {
    formFieldData["parentData"] = parentArr;
  } else if (action_from === "parent") {
    formFieldData["studentData"] = studentArr;
  }

  const form = useForm<z.infer<typeof LinkStudentWithParentFormSchema>>({
    resolver: zodResolver(LinkStudentWithParentFormSchema),
    defaultValues: {
      admission_number: "",
      first_name: "",
      last_name: "",
      parent: "",
    },
  });

  const { mutate: linkParentAndChild, isPending: isLinking } = useCustomMutation(
    StudentApiService.linkSchoolStudentWithParent,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: ["studentById"] });
        queryClient.invalidateQueries({ queryKey: [student_data?._id] });
        queryClient.invalidateQueries({ queryKey: ["parents"] });
        queryClient.invalidateQueries({ queryKey: ["parentById"] });
        queryClient.invalidateQueries({ queryKey: [parent_data?._id] });
        form.reset();
        closeOnSuccess();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof LinkStudentWithParentFormSchema>) {
    let processed_data: {
      admission_number: string;
      first_name: string;
      last_name: string;
      parent_id: string;
    } = { admission_number: "", first_name: "", last_name: "", parent_id: "" };

    switch (action_from) {
      case "student":
        processed_data = {
          admission_number: data.admission_number,
          first_name: data.first_name.toLowerCase(),
          last_name: data.last_name.toLowerCase(),
          parent_id: formFieldData.parentData.filter(
            (item: Parent) => item.email === data.parent,
          )[0]._id,
        };
        break;
      case "parent":
        processed_data = {
          admission_number: data.admission_number,
          first_name: data.first_name.toLowerCase(),
          last_name: data.last_name.toLowerCase(),
          parent_id: parent_data?._id as string,
        };
        break;
      default:
        break;
    }

    linkParentAndChild(processed_data);
  }

  const admission_number_status = form.watch("admission_number");

  useEffect(() => {
    if (action_from === "student" && student_data !== null && student_data !== undefined) {
      form.setValue("admission_number", student_data?.admission_number);
      form.setValue("first_name", TextHelper.capitalize(student_data?.first_name));
      form.setValue("last_name", TextHelper.capitalize(student_data?.last_name));
    } else if (action_from === "parent" && parent_data !== null && parent_data !== undefined) {
      form.setValue("parent", parent_data?.email);
      formFieldData.studentData.length > 0 &&
        formFieldData.studentData.forEach((student: Student) => {
          if (student.admission_number === admission_number_status) {
            form.setValue("first_name", TextHelper.capitalize(student.first_name));
            form.setValue("last_name", TextHelper.capitalize(student.last_name));
          }
        });
    }
  }, [action_from, student_data, parent_data, admission_number_status, form]);

  // TODO: Implement custom validation
  const validateFields = () => {};

  return (
    <div className="bg-background w-full max-w-[28rem] rounded">
      {isLoadingParentData || isLoadingStudentData ? (
        <div className="rounded border p-6">
          <CircularLoader text="Loading form data" />
        </div>
      ) : formFieldData.parentData && formFieldData.studentData ? (
        <ScrollArea className="h-full max-h-[80vh]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4 rounded-lg border px-4 py-6"
            >
              <FormLabel className="text-center text-lg uppercase">
                {action_from === "parent"
                  ? "Link student form"
                  : action_from === "student"
                    ? "Link parent Form"
                    : null}
              </FormLabel>

              {/* Render when linking from student page */}
              {action_from &&
                action_from == "student" &&
                student_data !== null &&
                formFieldData.parentData.length > 0 && (
                  <>
                    <ComboboxComponent
                      formName="parent"
                      formControl={form.control}
                      formLabel="Parent Record"
                      formOptionLabel="Select parent"
                      formOptionData={formFieldData.parentData}
                      formPlaceholder="Select parent"
                      displayValue={(data) =>
                        `${TextHelper.capitalize(
                          data.first_name,
                        )} ${TextHelper.capitalize(data.last_name)} - ${data.email}`
                      }
                      valueField="email"
                      disabled={isLinking}
                    />
                  </>
                )}

              {/* Render when linking from parent page */}
              {action_from &&
                action_from == "parent" &&
                parent_data !== null &&
                formFieldData.studentData.length > 0 && (
                  <>
                    <ComboboxComponent
                      formName="admission_number"
                      formControl={form.control}
                      formLabel="Student Admission Number"
                      formOptionLabel="Select Admission No."
                      formOptionData={formFieldData.studentData}
                      formPlaceholder="Select admission number"
                      displayValue={(data) => `${data.admission_number}`}
                      valueField="admission_number"
                      disabled={isLinking}
                    />

                    <InputComponent
                      formName="first_name"
                      formControl={form.control}
                      formLabel="Student First Name"
                      formPlaceholder=""
                      formInputType="text"
                      disabled={isLinking}
                      readOnly={true}
                    />

                    <InputComponent
                      formName="last_name"
                      formControl={form.control}
                      formLabel="Student Last Name"
                      formPlaceholder=""
                      formInputType="text"
                      disabled={isLinking}
                      readOnly={true}
                    />
                  </>
                )}

              <div className="flex justify-center gap-6">
                <CancelButton
                  onClose={() => {
                    form.reset();
                    onClose();
                  }}
                />

                <SubmitButton disabled={isLinking} loading={isLinking} text="Link" />
              </div>
            </form>
          </Form>
        </ScrollArea>
      ) : isParentError || isStudentError ? (
        <div>
          {isParentError && <ErrorBox error={parentError} />}
          {isStudentError && <ErrorBox error={studentError} />}
        </div>
      ) : (
        <ErrorBox message="No form data found. Please reload page." />
      )}
    </div>
  );
}
