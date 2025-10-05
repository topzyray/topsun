"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormDescription } from "@/components/ui/form";
import CheckboxComponent from "../../base/checkbox-component";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import { CircularLoader } from "../../../loaders/page-level-loader";
import Link from "next/link";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { Class, Subject } from "../../../../../types";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import ErrorBox from "@/components/atoms/error-box";
import SubmitButton from "@/components/buttons/SubmitButton";
import CancelButton from "@/components/buttons/CancelButton";
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

export const AddSubjectToClassFormSchema = z.object({
  subject_ids_array: z.array(z.string()).min(1, {
    message: "Subjects are required",
  }),
});

export default function AddSubjectToClass({
  class: classData,
  open,
  onClose,
  closeOnSuccess,
}: {
  class: Class;
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const { userDetails } = useAuth();

  let {
    data: subjectsApiData,
    isLoading: isLoadingSubjects,
    isError: isSubjectError,
    error: subjectError,
  } = useCustomQuery(["subjects"], async () => await SubjectApiService.getAllSubjects());

  let subjectData: Subject[] =
    subjectsApiData?.subjects !== undefined ? subjectsApiData?.subjects : [];

  const filteredSubjectData = DataHelper.findMissingItemsInArray(
    subjectData,
    classData?.compulsory_subjects,
  );

  const form = useForm<z.infer<typeof AddSubjectToClassFormSchema>>({
    resolver: zodResolver(AddSubjectToClassFormSchema),
    defaultValues: {
      subject_ids_array: [],
    },
  });

  let { mutate: addSubjectToClass, isPending: isAddingSubjectToClass } = useCustomMutation(
    SubjectApiService.addSubjectToClass,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["subjects"] });
        queryClient.invalidateQueries({ queryKey: ["classes"] });
        queryClient.invalidateQueries({ queryKey: ["classById"] });
        queryClient.invalidateQueries({ queryKey: [classData?._id] });
        queryClient.invalidateQueries({ queryKey: ["activeSession"] });
        closeOnSuccess();
        form.reset();
      },
    },
  );

  async function onSubmit(data: z.infer<typeof AddSubjectToClassFormSchema>) {
    const subjectIds = DataHelper.getMatchingValues(
      filteredSubjectData,
      data.subject_ids_array,
      (source, compare) => source.name === compare,
      (source) => source._id,
    );
    addSubjectToClass({
      requestBody: {
        subject_ids_array: subjectIds,
      },
      params: {
        class_id: classData?._id,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        {isLoadingSubjects ? (
          <CircularLoader text="Loading form data" />
        ) : filteredSubjectData != null ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <DialogHeader>
                <DialogTitle className="uppercase">Add Subject Form</DialogTitle>
              </DialogHeader>
              <DialogDescription></DialogDescription>

              <Separator />

              <CheckboxComponent
                formControl={form.control}
                formName="subject_ids_array"
                formLabel="All Created Subjects"
                formDescription={
                  <span>
                    Select ✅ subjects to add below. If subject is not in the below box,{" "}
                    <Link
                      href={`/dashboard/${userDetails?.role}/subjects`}
                      className="text-green-600 hover:underline"
                    >
                      create new subject
                    </Link>{" "}
                    and come back to add to class.
                  </span>
                }
                formData={filteredSubjectData}
                disabled={isAddingSubjectToClass}
              />

              {filteredSubjectData?.length == 0 && (
                <FormDescription>
                  No availabe subject to add.{" "}
                  <Link
                    href={`/dashboard/${userDetails?.role}/subjects`}
                    className="text-green-600 hover:underline"
                  >
                    Click here to create subjects
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
                  disabled={!form.formState.isValid || isAddingSubjectToClass}
                  loading={isAddingSubjectToClass}
                />{" "}
              </DialogFooter>
            </form>
          </Form>
        ) : isSubjectError ? (
          <ErrorBox error={subjectError} />
        ) : (
          <ErrorBox message="No subject data found." />
        )}
      </DialogContent>
    </Dialog>
  );
}
