"use client";

import React, { useContext, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import InputComponent from "../base/input-component";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Separator } from "@/components/ui/separator";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { ComboboxComponent } from "../base/combo-box-component";
import ErrorBox from "@/components/atoms/error-box";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { CbtApiService } from "@/api/services/CbtApiService";
import { ResultApiService } from "@/api/services/ResultApiService";
import { GlobalContext } from "@/providers/global-state-provider";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TextHelper } from "@/helpers/TextHelper";

type Item = {
  id: string;
  level: string;
  assessment_type: string;
  min_obj_questions: number;
  max_obj_questions: number;
  number_of_questions_per_student: number;
  expected_obj_number_of_options: number;
};

const ItemSchema = z.object({
  level: z.string().min(1, "Level is required"),
  assessment_type: z.string().min(1, "Assessment type is required"),
  min_obj_questions: z.coerce.number().min(1, "Minimum questions must be >= 1"),
  max_obj_questions: z.coerce.number().min(1, "Maximum questions must be >= 1"),
  number_of_questions_per_student: z.coerce.number().min(1, "Questions per student must be >= 1"),
  expected_obj_number_of_options: z.coerce.number().min(1, "Options must be >= 1"),
});

type ItemFormType = z.infer<typeof ItemSchema>;

export default function BulkCreateExamDocumentForm() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { activeSessionData, classLevel } = useContext(GlobalContext);

  const classLevelArray =
    classLevel?.data?.class_level_array?.map((level: string) => ({ level })) || [];

  const itemForm = useForm<ItemFormType>({
    resolver: zodResolver(ItemSchema),
    defaultValues: {
      level: "",
      assessment_type: "",
      min_obj_questions: 0,
      max_obj_questions: 0,
      number_of_questions_per_student: 0,
      expected_obj_number_of_options: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (editingId) {
      const it = items.find((i) => i.id === editingId);
      if (it) itemForm.reset(it);
    } else {
      itemForm.reset();
    }
  }, [editingId, itemForm, items]);

  const class_level_watch = itemForm.watch("level");
  const assessment_type_watch = itemForm.watch("assessment_type");

  const {
    data: resultSettings,
    isLoading: isLoadingResultSetting,
    isError: isResultSettingError,
    error: resultSetttingError,
  } = useCustomQuery(["results", "teacherById", class_level_watch || ""], () =>
    ResultApiService.getLevelResultSetting({ level: class_level_watch }),
  );

  const resultSettingsComponents = resultSettings?.result_setting;

  const cbtObj =
    resultSettingsComponents?.flattenedComponents?.length &&
    resultSettingsComponents?.flattenedComponents?.find((item: any) => item.key === "obj");

  useEffect(() => {
    if (cbtObj) {
      itemForm.setValue("assessment_type", TextHelper.allToUpperCase(cbtObj?.name));
    }
  }, [cbtObj, class_level_watch, itemForm]);

  const { mutate: createExamTermDoc, isPending: isCreatingExamTermDoc } = useCustomMutation(
    CbtApiService.createTermExamDocumentInASchool,
    {
      onSuccessCallback: () => {
        setItems([]);
        itemForm.reset();
      },
    },
  );

  function addOrUpdateItem(values: ItemFormType) {
    if (editingId) {
      setItems((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...values } : p)));
      setEditingId(null);
      itemForm.reset();
      return;
    }
    const id = crypto?.randomUUID?.() || String(Date.now());
    setItems((prev) => [...prev, { id, ...values }]);
    itemForm.reset();
  }

  function startEdit(id: string) {
    setEditingId(id);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      itemForm.reset();
    }
  }

  async function onSubmitAll() {
    if (!items.length) return;
    createExamTermDoc({
      requestBody: { assessment_document_array: items.map(({ id, ...rest }) => rest) },
      params: {
        academic_session_id: activeSessionData?.activeSession?._id as string,
        term: activeSessionData?.activeTerm?.name as string,
      },
    });
  }

  return (
    <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-4 md:flex-row">
      {/* Left form */}
      <Card className="max-w-xl flex-1 rounded bg-transparent">
        <CardHeader>
          <CardTitle>Add / Edit Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...itemForm}>
            <form
              onSubmit={itemForm.handleSubmit((values) => addOrUpdateItem(values))}
              className="space-y-4"
            >
              {classLevel?.loading ? (
                <CircularLoader text="Loading class level" parentClassName="text-xs" />
              ) : classLevelArray.length > 0 ? (
                <ComboboxComponent
                  formName="level"
                  formControl={itemForm.control}
                  formLabel="Class Level"
                  formOptionLabel="Select class level"
                  formPlaceholder=""
                  formOptionData={classLevelArray.filter(
                    (levelObj) =>
                      // allow levels not already used
                      !items.some((it) => it.level === levelObj.level) ||
                      // OR allow if we're editing this item and it's the same level
                      (editingId !== null &&
                        items.find((it) => it.id === editingId)?.level === levelObj.level),
                  )}
                  disabled={isCreatingExamTermDoc}
                  displayValue={(data) => data.level}
                  valueField="level"
                />
              ) : classLevel?.error ? (
                <ErrorBox error={classLevel?.error} />
              ) : (
                <p className="rounded-lg border px-4 py-3.5">No class level found</p>
              )}

              {/* Only show assessment type AFTER level is chosen */}
              {class_level_watch && (
                <>
                  {isLoadingResultSetting ? (
                    <CircularLoader text="Loading result settings" />
                  ) : resultSettingsComponents?.flattenedComponents?.length ? (
                    // <ComboboxComponent
                    //   formName="assessment_type"
                    //   formControl={itemForm.control}
                    //   formLabel="Assessment Type"
                    //   formOptionLabel="Select assessment type"
                    //   formPlaceholder=""
                    //   formOptionData={resultSettingsComponents.flattenedComponents}
                    //   disabled={isCreatingExamTermDoc}
                    //   displayValue={(data: any) => data.name}
                    //   valueField="name"
                    // />
                    <InputComponent
                      formName="assessment_type"
                      formControl={itemForm.control}
                      formLabel="Assessment Type"
                      formInputType="text"
                      formPlaceholder=""
                      disabled={isCreatingExamTermDoc}
                      readOnly
                    />
                  ) : isResultSettingError ? (
                    <ErrorBox error={resultSetttingError} />
                  ) : null}
                </>
              )}

              {/* Only show remaining fields AFTER both level & assessment_type are chosen */}
              {class_level_watch && assessment_type_watch && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <InputComponent
                      formName="min_obj_questions"
                      formControl={itemForm.control}
                      formLabel="Min Questions"
                      formInputType="number"
                      formPlaceholder="e.g., 10"
                      disabled={isCreatingExamTermDoc}
                    />
                    <InputComponent
                      formName="max_obj_questions"
                      formControl={itemForm.control}
                      formLabel="Max Questions"
                      formInputType="number"
                      formPlaceholder="e.g., 60"
                      disabled={isCreatingExamTermDoc}
                    />
                    <InputComponent
                      formName="number_of_questions_per_student"
                      formControl={itemForm.control}
                      formLabel="Questions per Student"
                      formInputType="number"
                      formPlaceholder="e.g., 20"
                      disabled={isCreatingExamTermDoc}
                    />
                    <InputComponent
                      formName="expected_obj_number_of_options"
                      formControl={itemForm.control}
                      formLabel="Options"
                      formInputType="number"
                      formPlaceholder="e.g., 4"
                      disabled={isCreatingExamTermDoc}
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="submit"
                      disabled={!itemForm.formState.isValid || isCreatingExamTermDoc}
                    >
                      {editingId ? "Update" : "Add to list"}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingId(null);
                          itemForm.reset();
                        }}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </div>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Right table */}
      <Card className="w-full flex-1 rounded bg-transparent">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Assessment List</CardTitle>
          <p className="text-muted-foreground text-xs">{items.length} item(s)</p>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="rounded-lg border px-4 py-3.5 text-sm">No items added yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Level</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Min</TableHead>
                    <TableHead>Max</TableHead>
                    <TableHead>Per Student</TableHead>
                    <TableHead>Options</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((it) => (
                    <TableRow key={it.id}>
                      <TableCell>{it.level}</TableCell>
                      <TableCell>{it.assessment_type}</TableCell>
                      <TableCell>{it.min_obj_questions}</TableCell>
                      <TableCell>{it.max_obj_questions}</TableCell>
                      <TableCell>{it.number_of_questions_per_student}</TableCell>
                      <TableCell>{it.expected_obj_number_of_options}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(it.id)}>
                            Edit
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => removeItem(it.id)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <Separator className="my-4" />

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-muted-foreground text-sm">
              Tip: Add all the level assessments, edit inline, then submit all at once.
            </p>
            <SubmitButton
              disabled={items.length === 0 || isCreatingExamTermDoc}
              loading={isCreatingExamTermDoc}
              text="Submit all"
              onSubmit={onSubmitAll as any}
            />
          </div>

          {/* <div className="mt-4">
            <h4 className="mb-2 text-xs font-medium">Payload Preview</h4>
            <pre className="bg-muted max-h-40 overflow-auto rounded-md border p-3 text-xs">
              {JSON.stringify(
                { assessment_document_array: items.map(({ id, ...rest }) => rest) },
                null,
                2,
              )}
            </pre>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
