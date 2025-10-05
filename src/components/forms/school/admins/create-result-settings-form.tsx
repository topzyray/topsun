"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import SubmitButton from "@/components/buttons/SubmitButton";
import { SuperAdminApiService } from "@/api/services/SuperAdminApiService";
import InputComponent from "../../base/input-component";
import { ComboboxComponent } from "../../base/combo-box-component";
import ErrorBox from "@/components/atoms/error-box";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SelectComponent from "../../base/select-component";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  level: z.string().min(1, {
    message: "Level is required",
  }),
  name_percent_array: z
    .array(
      z.object({
        name: z.string().min(1, { message: "Name is required" }),
        percentage: z.coerce.number().min(0).max(100),
        column: z.coerce.number().int().min(1),
      }),
    )
    .min(1, { message: "At least one name/percentage entry is required" }),
  grading_array: z
    .array(
      z.object({
        value: z.coerce.number().min(0),
        grade: z
          .string()
          .min(1)
          .transform((g) => g.toUpperCase()),
        remark: z.string().min(1, { message: "Remark is required" }),
      }),
    )
    .min(1, { message: "At least one grade is required" })
    .refine(
      (items) => {
        const grades = items.map((item) => item.grade);
        return new Set(grades).size === grades.length;
      },
      { message: "Grade letters must be unique.", path: ["grading_array"] },
    ),
  exam_name: z.string().min(1, {
    message: "Exam name is required",
  }),
  exam_types: z
    .array(
      z.object({
        key: z.string().min(1, { message: "Key is required" }),
        name: z.string().min(1, { message: "Exam type name is required" }),
        percentage: z.coerce.number().min(0).max(100),
      }),
    )
    .min(1, { message: "At least one exam type is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateResultSettingsForm() {
  const queryClient = useQueryClient();

  const {
    data: schoolClassLevelData,
    isLoading: isLoadingSchoolClassLevelData,
    isError: isSchoolClassLevelDataError,
    error: schoolClassLevelDataError,
  } = useCustomQuery(["class_level"], SuperAdminApiService.getAllClassLevelsOfASchool);

  let classLevel =
    schoolClassLevelData?.class_level?.class_level_array !== undefined &&
    schoolClassLevelData?.class_level?.class_level_array;

  classLevel = classLevel && classLevel.length && classLevel.map((level: string) => ({ level }));

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "",
      name_percent_array: [{ name: "", percentage: 0, column: 1 }],
      grading_array: [{ value: 0, grade: "", remark: "" }],
      exam_name: "",
      exam_types: [{ key: "", name: "", percentage: 0 }],
    },
  });

  const {
    fields: namePercentFields,
    append: appendNamePercent,
    remove: removeNamePercent,
  } = useFieldArray({
    name: "name_percent_array",
    control: form.control,
  });

  const {
    fields: gradingFields,
    append: appendGrading,
    remove: removeGrading,
  } = useFieldArray({
    name: "grading_array",
    control: form.control,
  });

  const {
    fields: examTypesFields,
    append: appendExamType,
    remove: removeExamType,
  } = useFieldArray({
    name: "exam_types",
    control: form.control,
  });

  const { mutate: createResultSetting, isPending: isCreatingResultSettings } = useCustomMutation(
    SuperAdminApiService.createResultSettingInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["results"] });
        queryClient.invalidateQueries({ queryKey: ["scores"] });
        form.reset();
        form.reset();
      },
    },
  );

  const onSubmit = (data: FormValues) => {
    createResultSetting({
      requestBody: {
        grading_array: data?.grading_array,
        name_percent_array: data?.name_percent_array,
        exam_components: {
          exam_name: data?.exam_name,
          component: data?.exam_types,
        },
      },
      params: {
        level: data?.level,
      },
    });
  };

  return (
    <div className="bg-background mx-auto mt-6 w-full max-w-2xl rounded border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
          <Card className="space-y-4 rounded-none p-4">
            <h2 className="text-center text-lg uppercase">Create Result Settings Form</h2>
            {isLoadingSchoolClassLevelData ? (
              <CircularLoader text="Loading school class level" />
            ) : classLevel && classLevel.length > 0 ? (
              <ComboboxComponent
                formName="level"
                formControl={form.control}
                formLabel="Class Level"
                formPlaceholder=""
                formOptionLabel="Select class level"
                formOptionData={classLevel}
                disabled={isCreatingResultSettings}
                displayValue={(data) => data.level}
                valueField="level"
              />
            ) : isSchoolClassLevelDataError ? (
              <ErrorBox error={schoolClassLevelDataError} />
            ) : (
              <ErrorBox message="Please create class level" />
            )}

            <section>
              <Label className="text-lg">Result Header Format</Label>
              <Card className="space-y-4 rounded-none p-4">
                <Accordion type="multiple" className="w-full space-y-2">
                  {namePercentFields.map((field, index) => (
                    <div key={field.id} className="rounded border px-4">
                      <AccordionItem value={`q-${index}`}>
                        <AccordionTrigger className="text-lg hover:cursor-pointer">
                          Header Format Item {index + 1}
                        </AccordionTrigger>
                        <AccordionContent className="bg-sidebar mb-2 rounded-lg p-4">
                          <div className="space-y-3">
                            <InputComponent
                              formName={`name_percent_array.${index}.name`}
                              formControl={form.control}
                              formLabel="Header Name"
                              formPlaceholder="e.g. Test"
                              disabled={isCreatingResultSettings}
                              formInputType="text"
                              inputClassName="py-2"
                            />

                            <InputComponent
                              formName={`name_percent_array.${index}.percentage`}
                              formControl={form.control}
                              formLabel="Header Percentage"
                              formPlaceholder="e.g. 20"
                              disabled={isCreatingResultSettings}
                              formInputType="number"
                              inputClassName="py-2"
                            />

                            <InputComponent
                              formName={`name_percent_array.${index}.column`}
                              formControl={form.control}
                              formLabel="Column Number"
                              formPlaceholder="e.g. 1"
                              disabled={isCreatingResultSettings}
                              formInputType="number"
                              inputClassName="py-2"
                            />

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeNamePercent(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>

                <div className="flex justify-end gap-x-4">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => appendNamePercent({ name: "", percentage: 0, column: 1 })}
                    disabled={isCreatingResultSettings}
                  >
                    Add Result Header
                  </Button>
                </div>
              </Card>
            </section>

            <section>
              <Label className="text-lg">Grading Points</Label>
              <Card className="space-y-4 rounded-none p-4">
                <Accordion type="multiple" className="w-full space-y-2">
                  {gradingFields.map((field, index) => (
                    <div key={field.id} className="rounded border px-4">
                      <AccordionItem value={`q-${index}`}>
                        <AccordionTrigger className="text-lg hover:cursor-pointer">
                          Grading Point Item {index + 1}
                        </AccordionTrigger>
                        <AccordionContent className="bg-sidebar mb-4 rounded-lg p-4">
                          <div className="space-y-3">
                            <InputComponent
                              formName={`grading_array.${index}.value`}
                              formControl={form.control}
                              formLabel="Value"
                              formPlaceholder="e.g. 70"
                              disabled={isCreatingResultSettings}
                              formInputType="number"
                              inputClassName="py-2"
                            />

                            <InputComponent
                              formName={`grading_array.${index}.grade`}
                              formControl={form.control}
                              formLabel="Grade"
                              formPlaceholder="e.g. A"
                              disabled={isCreatingResultSettings}
                              formInputType="text"
                              inputClassName="py-2"
                            />

                            <InputComponent
                              formName={`grading_array.${index}.remark`}
                              formControl={form.control}
                              formLabel="Remark"
                              formPlaceholder="e.g. Excellent"
                              disabled={isCreatingResultSettings}
                              formInputType="text"
                              inputClassName="py-2"
                            />

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeGrading(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>

                <div className="flex justify-end gap-x-4">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => appendGrading({ value: 0, grade: "", remark: "" })}
                    disabled={isCreatingResultSettings}
                  >
                    Add Grading Point
                  </Button>
                </div>
              </Card>
            </section>

            <InputComponent
              formControl={form.control}
              formName="exam_name"
              formLabel="Exam Title"
              formPlaceholder="e.g. First term exam"
              formInputType="text"
              disabled={isCreatingResultSettings}
            />

            <section>
              <Label className="text-lg">Exam Types</Label>
              <Card className="space-y-4 rounded-none p-4">
                <Accordion type="multiple" className="w-full space-y-2">
                  {examTypesFields.map((field, index) => (
                    <div key={field.id} className="border px-4 hover:cursor-pointer">
                      <AccordionItem value={`q-${index}`}>
                        <AccordionTrigger className="lg:text-lg">
                          Exam Type Item {index + 1}
                        </AccordionTrigger>
                        <AccordionContent className="bg-sidebar mb-4 rounded-lg p-4">
                          <div className="space-y-3">
                            <SelectComponent
                              formName={`exam_types.${index}.key`}
                              formControl={form.control}
                              formLabel="Exam Key"
                              formPlaceholder="e.g. Theory"
                              formOptionLabel="Select key"
                              formOptionData={[
                                { label: "OBJ", value: "obj" },
                                { label: "Theory", value: "theory" },
                              ]}
                              disabled={isCreatingResultSettings}
                              inputClassName="py-2"
                            />

                            <InputComponent
                              formName={`exam_types.${index}.name`}
                              formControl={form.control}
                              formLabel="Exam Name"
                              formPlaceholder="e.g. Theory"
                              disabled={isCreatingResultSettings}
                              formInputType="text"
                              inputClassName="py-2"
                            />

                            <InputComponent
                              formName={`exam_types.${index}.percentage`}
                              formControl={form.control}
                              formLabel="Exam Percentage"
                              formPlaceholder="e.g. 40"
                              disabled={isCreatingResultSettings}
                              formInputType="number"
                              inputClassName="py-2"
                            />

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeExamType(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </div>
                  ))}
                </Accordion>

                <div className="flex justify-end gap-x-4">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => appendExamType({ key: "", name: "", percentage: 0 })}
                    disabled={isCreatingResultSettings}
                  >
                    Add Exam Type
                  </Button>
                </div>
              </Card>
            </section>
          </Card>

          <div>
            <SubmitButton
              loading={isCreatingResultSettings}
              type="submit"
              size="lg"
              disabled={isCreatingResultSettings || !form.formState.isValid}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
