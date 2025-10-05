"use client";

import { z } from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { CbtApiService } from "@/api/services/CbtApiService";
import { useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import InputComponent from "../base/input-component";
import SubmitButton from "@/components/buttons/SubmitButton";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { TermExamDocument } from "../../../../types";
import ErrorBox from "@/components/atoms/error-box";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { ResultApiService } from "@/api/services/ResultApiService";
import { ComboboxComponent } from "../base/combo-box-component";

const QuestionSchema = z
  .object({
    question_text: z.string().min(1, "Question text is required"),
    question_number: z.number(),
    options: z
      .array(z.string().min(1))
      .min(4, "Must provide minimum of 4 options")
      .refine((opts) => new Set(opts).size === opts.length, { message: "Options must be unique" }),
    correct_answer: z.string().min(1, "Correct answer is required"),
    score: z.coerce.number().min(1, "Score is required"),
  })
  .refine((data) => data.options.includes(data.correct_answer), {
    message: "Correct answer must be one of the options",
    path: ["correct_answer"], // pin error to the correct_answer field
  });

const FormSchema = z.object({
  assessment_type: z.string().min(1, {
    message: "Assessment type is required",
  }),
  questions_array: z
    .array(QuestionSchema)
    .min(1, "Questions cannot be empty")
    .refine(
      (questions) => new Set(questions.map((q) => q.question_number)).size === questions.length,
      {
        message: "Question numbers must be unique",
        path: ["questions_array"],
      },
    ),
});

type FormSchemaType = z.infer<typeof FormSchema>;

export default function ObjQuestionsForm({ params }: { params: Record<string, any> }) {
  const { activeSessionData } = useContext(GlobalContext);
  const queryClient = useQueryClient();

  const class_level = decodeURIComponent(params.class_level);

  const {
    data: resultSettings,
    isLoading: isLoadingResultSetting,
    isError: isResultSettingError,
    error: resultSetttingError,
  } = useCustomQuery(["results", "teacherById", class_level || ""], () =>
    ResultApiService.getLevelResultSetting({ level: class_level }),
  );
  const resultSettingsComponents = resultSettings?.result_setting;

  const {
    data: termExamDocApi,
    isLoading: isLoadingTermExamDocApi,
    isError: isTermExamDocError,
    error: termExamDocError,
  } = useCustomQuery(["termExamDocument"], () =>
    CbtApiService.getTermCbtAssessmentDocumentInASchool({
      academic_session_id: activeSessionData?.activeSession?._id as string,
      term: activeSessionData?.activeTerm?.name as string,
    }),
  );

  const termExamDocument: TermExamDocument =
    termExamDocApi?.exam_document && termExamDocApi?.exam_document;

  const form = useForm<FormSchemaType>({
    defaultValues: {
      assessment_type: "",
      questions_array: Array.from({ length: 1 }).map((_, i) => ({
        question_number: i + 1,
        question_text: "",
        options: [],
        correct_answer: "",
        score: 0,
      })),
    },
    resolver: zodResolver(FormSchema),
  });

  const {
    fields: objQuestionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control: form.control,
    name: "questions_array",
  });

  let { mutate: setObjQuestion, isPending: isSettingObjQuestions } = useCustomMutation(
    CbtApiService.setSubjectCbtObjQuestionsForAClassInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["objQuestions"] });
        form.reset();
      },
    },
  );

  const onSubmit = async (data: FormSchemaType) => {
    setObjQuestion({
      requestBody: {
        questions_array: data?.questions_array,
        subject_id: params?.subject_id,
        term: activeSessionData?.activeTerm?.name as string,
        assessment_type: data?.assessment_type,
      },
      params: {
        academic_session_id: activeSessionData?.activeSession?._id as string,
        class_id: params?.class_id,
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      {isLoadingTermExamDocApi ? (
        <CircularLoader text="Loading required components" />
      ) : termExamDocument !== undefined ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="space-y-4 rounded-none bg-transparent p-4">
              <h2 className="text-center text-lg uppercase">OBJ Questions Form</h2>

              {class_level ? (
                isLoadingResultSetting ? (
                  <CircularLoader text={`Loading result settings ${class_level}`} />
                ) : resultSettingsComponents?.flattenedComponents?.length ? (
                  <ComboboxComponent
                    formName="assessment_type"
                    formControl={form.control}
                    formLabel="Assessment Type"
                    formOptionLabel="Select assessment type"
                    formOptionData={resultSettingsComponents.flattenedComponents}
                    formPlaceholder=""
                    disabled={isSettingObjQuestions}
                    displayValue={(data: any) => data.name}
                    valueField="name"
                  />
                ) : isResultSettingError ? (
                  <ErrorBox error={resultSetttingError} containerClassName="md:self-end md:mb-2" />
                ) : (
                  <InputComponent
                    formName="assessment_type"
                    formControl={form.control}
                    formLabel="Assessment Type"
                    formInputType="text"
                    formPlaceholder="e.g. First term exam"
                    disabled={isSettingObjQuestions}
                  />
                )
              ) : (
                // keep the second column space balanced
                <div />
              )}

              <Accordion type="multiple" className="w-full space-y-2">
                {objQuestionFields.map((field, index) => (
                  <div key={field.id} className="border px-4">
                    <AccordionItem value={`q-${index}`}>
                      <AccordionTrigger className="hover:cursor-pointer lg:text-lg">
                        Question {index + 1}
                      </AccordionTrigger>
                      <AccordionContent className="mb-4 rounded-lg">
                        <div className="space-y-3">
                          <InputComponent
                            formName={`questions_array.${index}.question_text`}
                            formControl={form.control}
                            formLabel="Question Text"
                            formPlaceholder=""
                            disabled={isSettingObjQuestions}
                            formInputType="text"
                            inputClassName="py-2"
                          />

                          <div>
                            <Label className="text-lg">Options</Label>
                            <div className="space-y-1">
                              {Array(termExamDocument?.expected_obj_number_of_options)
                                .fill(null)
                                .map((_, optIdx) => (
                                  <InputComponent
                                    key={optIdx}
                                    formName={`questions_array.${index}.options.${optIdx}`}
                                    formControl={form.control}
                                    formLabel=""
                                    formPlaceholder={`Option ${optIdx + 1}`}
                                    disabled={isSettingObjQuestions}
                                    formInputType="text"
                                    inputClassName="py-2"
                                  />
                                ))}
                            </div>
                          </div>

                          <InputComponent
                            formName={`questions_array.${index}.correct_answer`}
                            formControl={form.control}
                            formLabel="Correct Answer"
                            formPlaceholder=""
                            disabled={isSettingObjQuestions}
                            formInputType="text"
                            inputClassName="py-2"
                          />

                          <InputComponent
                            formName={`questions_array.${index}.score`}
                            formControl={form.control}
                            formLabel="Score"
                            formPlaceholder=""
                            disabled={isSettingObjQuestions}
                            formInputType="number"
                            inputClassName="py-2"
                          />

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeQuestion(index)}
                          >
                            Remove
                          </Button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </div>
                ))}
              </Accordion>

              <div className="flex justify-center gap-x-4">
                <Button
                  size="lg"
                  type="button"
                  onClick={() => {
                    appendQuestion({
                      question_number: objQuestionFields.length + 1,
                      question_text: "",
                      options: [],
                      correct_answer: "",
                      score: 0,
                    });
                  }}
                >
                  Add Question
                </Button>

                <SubmitButton
                  size="lg"
                  loading={isSettingObjQuestions}
                  type="submit"
                  disabled={!form.formState.isValid || isSettingObjQuestions}
                />
              </div>
            </Card>
          </form>
        </Form>
      ) : isTermExamDocError ? (
        <ErrorBox error={termExamDocError} />
      ) : (
        <ErrorBox message="No Term Exam Document Created Yet" />
      )}
    </div>
  );
}
