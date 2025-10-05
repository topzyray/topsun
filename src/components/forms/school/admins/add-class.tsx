"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { Form, FormDescription } from "@/components/ui/form";
import { ClassApiService } from "@/api/services/ClassApiService";
import InputComponent from "../../base/input-component";
import CheckboxComponent from "../../base/checkbox-component";
import { useContext, useEffect } from "react";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import { CircularLoader } from "../../../loaders/page-level-loader";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { Subject } from "../../../../../types";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { AddNewClassFormSchema } from "@/api/schemas/ClassSchemas";
import ErrorBox from "@/components/atoms/error-box";
import SubmitButton from "@/components/buttons/SubmitButton";
import CancelButton from "@/components/buttons/CancelButton";
import { ComboboxComponent } from "../../base/combo-box-component";
import { GlobalContext } from "@/providers/global-state-provider";
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
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AddNewClass({
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
  const { classLevel } = useContext(GlobalContext);

  const classLevelArray =
    classLevel?.data?.class_level_array &&
    classLevel?.data?.class_level_array.length &&
    classLevel?.data?.class_level_array.map((level: string) => ({
      level,
    }));

  let {
    data: subjectsApiData,
    isLoading: isLoadingSubjects,
    isError: isSubjectError,
    error: subjectError,
  } = useCustomQuery(["subjects"], SubjectApiService.getAllSubjects);

  let subjectData: Subject[] =
    (subjectsApiData?.subjects !== undefined && subjectsApiData?.subjects) ?? [];

  const form = useForm<z.infer<typeof AddNewClassFormSchema>>({
    resolver: zodResolver(AddNewClassFormSchema),
    defaultValues: {
      name: "",
      description: "",
      level: "",
      section: "",
      compulsory_subjects: [],
    },
  });

  let { mutate: createClass, isPending: isCreatingClass } = useCustomMutation(
    ClassApiService.createAClass,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["classById"] });
        closeOnSuccess();
        form.reset();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof AddNewClassFormSchema>) {
    createClass({ ...data });
  }

  const level_data = form.watch("level");
  const section_data = form.watch("section");

  useEffect(() => {
    if (level_data && section_data) {
      form.setValue("name", level_data + section_data);
    }
  }, [level_data, section_data, form]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        {isLoadingSubjects ? (
          <CircularLoader text="Loading form data" />
        ) : subjectData != null ? (
          <ScrollArea className="h-full max-h-[80vh]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <DialogHeader>
                  <DialogTitle className="uppercase">Class Creation Form</DialogTitle>
                </DialogHeader>
                <DialogDescription></DialogDescription>

                <Separator />

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
                    disabled={isCreatingClass}
                    displayValue={(data) => data.level}
                    valueField="level"
                  />
                ) : classLevel?.error ? (
                  <ErrorBox error={classLevel?.error} />
                ) : (
                  <p className="rounded-lg border px-4 py-3.5">No class level found</p>
                )}

                <InputComponent
                  formName="section"
                  formControl={form.control}
                  formLabel="Class Section"
                  formInputType="text"
                  disabled={isCreatingClass}
                />

                <InputComponent
                  formName="name"
                  formControl={form.control}
                  formLabel="Class Name"
                  formInputType="text"
                  disabled={isCreatingClass}
                  editable={true}
                />

                <InputComponent
                  formName="description"
                  formControl={form.control}
                  formLabel="Class Description"
                  formInputType="text"
                  disabled={isCreatingClass}
                />

                <CheckboxComponent
                  formControl={form.control}
                  formName="compulsory_subjects"
                  formLabel="All Subjects"
                  formDescription={"Select at least five (5) subjects below"}
                  formData={subjectData}
                  disabled={isCreatingClass}
                />

                {subjectData?.length == 0 && (
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
                    disabled={!form.formState.isValid || isCreatingClass}
                    loading={isCreatingClass}
                  />
                </DialogFooter>
              </form>
            </Form>
          </ScrollArea>
        ) : isSubjectError ? (
          <ErrorBox error={subjectError} />
        ) : (
          <ErrorBox message="No subject data found." />
        )}
      </DialogContent>
    </Dialog>
  );
}
