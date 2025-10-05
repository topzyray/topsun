"use client";

import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import SubmitButton from "@/components/buttons/SubmitButton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CbtApiService } from "@/api/services/CbtApiService";
import { GlobalContext } from "@/providers/global-state-provider";
import { DataHelper } from "@/helpers/DataHelper";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import { Subject } from "../../../../types";
import ErrorBox from "@/components/atoms/error-box";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { ComboboxComponent } from "../base/combo-box-component";
import InputComponent from "../base/input-component";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { ResultApiService } from "@/api/services/ResultApiService";
import { TextHelper } from "@/helpers/TextHelper";

type TimetableItem = {
  id: string;
  subject: string;
  start_time: string;
  duration: number;
};

const selectorSchema = z.object({
  assessment_type: z.string().min(1, "Assessment type is required"),
});
type SelectorValues = z.infer<typeof selectorSchema>;

const itemSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  start_time: z.string().min(1, "Start time is required"),
  duration: z.coerce.number().min(1, "Duration must be >= 1"),
});
type ItemValues = z.infer<typeof itemSchema>;

export default function CreateExamTimetableTwoSection({ params }: { params: Record<string, any> }) {
  const { activeSessionData } = useContext(GlobalContext);
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();

  const class_level = decodeURIComponent(params.class_level);

  // selectors form
  const selectorForm = useForm<SelectorValues>({
    resolver: zodResolver(selectorSchema),
    defaultValues: { assessment_type: "" },
    mode: "onChange",
  });

  // item form (for add/edit one timetable row)
  const itemForm = useForm<ItemValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: { subject: "", start_time: "", duration: 0 },
    mode: "onChange",
  });

  const [items, setItems] = useState<TimetableItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // fetch class subjects
  const {
    data: classSubjects,
    isLoading: isLoadingClassSubjects,
    isError: isClassSubjectError,
    error: classSubjectError,
  } = useCustomQuery(
    ["class_subjects", params.class_id],
    () => SubjectApiService.getAllClassSubjectsByClassId(params.class_id),
    { id: params.class_id },
    Boolean(params.class_id),
  );

  const classSubjectData: Subject[] = classSubjects?.class_subjects ?? [];

  // const class_level_watch = selectorForm.watch("level");
  const assessment_type_watch = selectorForm.watch("assessment_type");

  // result settings for assessment_type options
  const {
    data: resultSettings,
    isLoading: isLoadingResultSetting,
    isError: isResultSettingError,
    error: resultSetttingError,
  } = useCustomQuery(["results", "teacherById", class_level || ""], () =>
    ResultApiService.getLevelResultSetting({ level: class_level }),
  );
  const resultSettingsComponents = resultSettings?.result_setting;

  // Mutation to submit full timetable (level + assessment_type + timetable_array)
  const { mutate: createExamTimetable, isPending: isCreatingExamTimetable } = useCustomMutation(
    CbtApiService.createTermClassExamTimetableInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["timetable", params.class_id] });
        // optional: clear items after successful create
        setItems([]);
        router.back();
      },
    },
  );

  // Add or update single timetable item (local)
  function addOrUpdateItem(values: ItemValues) {
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
    const it = items.find((i) => i.id === id);
    if (!it) return;
    setEditingId(id);
    itemForm.reset({
      subject: it.subject,
      start_time: it.start_time,
      duration: it.duration,
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
    if (editingId === id) {
      setEditingId(null);
      itemForm.reset();
    }
  }

  // submit all (send to API)
  function onSubmitAll() {
    // ensure selectors are valid
    selectorForm.trigger().then((ok) => {
      if (!ok) return;
      if (items.length === 0) return;
      const processed_timetable = DataHelper.mapSubjectsToIds(
        items.map(({ id, ...rest }) => rest),
        classSubjectData,
      );

      createExamTimetable({
        requestBody: {
          level: class_level,
          assessment_type: selectorForm.getValues("assessment_type"),
          timetable_array: processed_timetable,
          term: activeSessionData?.activeTerm?.name as string,
        },
        params: {
          academic_session_id: activeSessionData?.activeSession?._id as string,
          class_id: params.class_id,
        },
      });
    });
  }

  // convenience derived state for subject picklist when adding/editing
  const selectedSubjects = items.map((i) => i.subject);

  return (
    <div className="mx-auto mt-8 w-full max-w-6xl space-y-6">
      {/* SECTION 1: Selectors */}
      <Card className="bg-transparent">
        <CardHeader>
          <CardTitle>Create Assessment Timetable — Selectors</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...selectorForm}>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* ASSESSMENT TYPE */}
              {class_level ? (
                isLoadingResultSetting ? (
                  <CircularLoader text={`Loading result settings ${class_level}`} />
                ) : resultSettingsComponents?.flattenedComponents?.length ? (
                  <ComboboxComponent
                    formName="assessment_type"
                    formControl={selectorForm.control}
                    formLabel="Assessment Type"
                    formOptionLabel="Select assessment type"
                    formOptionData={resultSettingsComponents.flattenedComponents}
                    formPlaceholder=""
                    disabled={isCreatingExamTimetable}
                    displayValue={(data: any) => data.name}
                    valueField="name"
                  />
                ) : isResultSettingError ? (
                  <ErrorBox error={resultSetttingError} containerClassName="md:self-end md:mb-2" />
                ) : (
                  <InputComponent
                    formName="assessment_type"
                    formControl={selectorForm.control}
                    formLabel="Assessment Type"
                    formInputType="text"
                    formPlaceholder="e.g. First term exam"
                    disabled={isCreatingExamTimetable}
                  />
                )
              ) : (
                // keep the second column space balanced
                <div />
              )}
            </form>
          </Form>
          <p className="text-muted-foreground mt-3 text-sm">
            Note: level and assessment type are editable independently from the timetable rows. If
            you want to manage the active assessment type, visit the{" "}
            <Link href={`/dashboard/${userDetails?.role}/cbt`}>Assessment page</Link>.
          </p>
        </CardContent>
      </Card>

      {/* SECTION 2: Timetable CRUD (left: form; right: table view) */}
      {class_level && assessment_type_watch && (
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          {/* Left: Add/Edit item */}
          <Card className="col-span-1 w-full bg-transparent">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Timetable Row" : "Add Timetable Row"}</CardTitle>
            </CardHeader>
            <CardContent className="w-full">
              <Form {...itemForm}>
                <form
                  onSubmit={itemForm.handleSubmit((vals) => addOrUpdateItem(vals))}
                  className="w-full space-y-4"
                >
                  {isLoadingClassSubjects ? (
                    <CircularLoader text="Loading subject data" />
                  ) : classSubjectData ? (
                    <>
                      {/* compute available options: exclude subjects already selected except when editing that item */}
                      <ComboboxComponent
                        formName="subject"
                        formControl={itemForm.control}
                        formLabel="Subject"
                        formOptionLabel="Select subject"
                        formOptionData={
                          classSubjectData.filter((s) => {
                            // if editing, allow current subject
                            if (editingId) {
                              const editingItem = items.find((i) => i.id === editingId);
                              if (editingItem?.subject === s.name) return true;
                            }
                            return !selectedSubjects.includes(s.name);
                          }) ?? []
                        }
                        formPlaceholder=""
                        disabled={isCreatingExamTimetable}
                        displayValue={(data) => data.name}
                        valueField="name"
                      />

                      <InputComponent
                        formName="start_time"
                        formControl={itemForm.control}
                        formLabel="Date and Start Time"
                        formInputType="datetime-local"
                        formPlaceholder=""
                        disabled={isCreatingExamTimetable}
                      />

                      <InputComponent
                        formName="duration"
                        formControl={itemForm.control}
                        formLabel="Duration (minutes)"
                        formInputType="number"
                        formPlaceholder="e.g. 60"
                        disabled={isCreatingExamTimetable}
                      />
                    </>
                  ) : isClassSubjectError ? (
                    <ErrorBox error={classSubjectError} />
                  ) : null}

                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      disabled={!itemForm.formState.isValid || isCreatingExamTimetable}
                    >
                      {editingId ? "Update Row" : "Add Row"}
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
                        Cancel
                      </Button>
                    )}

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setItems([]);
                        setEditingId(null);
                        itemForm.reset();
                      }}
                      disabled={items.length === 0}
                    >
                      Clear All Rows
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Right: Table (spans 2 columns) */}
          <Card className="col-span-2 bg-transparent">
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Timetable Rows</CardTitle>
                <p className="text-muted-foreground text-sm">{items.length} row(s)</p>
              </div>
              <div className="flex items-center gap-2">
                {/* <Button
                  type="button"
                  onClick={onSubmitAll}
                  disabled={
                    items.length === 0 ||
                    // !selectorForm.formState.isValid ||
                    isCreatingExamTimetable ||
                    !class_level_watch ||
                    !assessment_type_watch
                  }
                >
                  Submit All
                </Button> */}
                <SubmitButton
                  loading={isCreatingExamTimetable}
                  onSubmit={onSubmitAll as any}
                  disabled={
                    items.length === 0 ||
                    // !selectorForm.formState.isValid ||
                    isCreatingExamTimetable ||
                    !class_level ||
                    !assessment_type_watch
                  }
                />
              </div>
            </CardHeader>

            <CardContent>
              {items.length === 0 ? (
                <p className="rounded-lg border px-4 py-3.5 text-sm">No timetable rows added yet</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead>Exam Date</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>Duration (mins)</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((it) => (
                        <TableRow key={it.id}>
                          <TableCell className="capitalize">{it.subject}</TableCell>
                          <TableCell>{TextHelper.getFormattedDate(it.start_time)}</TableCell>
                          <TableCell>{TextHelper.getFormattedTime(it.start_time)}</TableCell>
                          <TableCell>{it.duration}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => startEdit(it.id)}>
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeItem(it.id)}
                              >
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
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
