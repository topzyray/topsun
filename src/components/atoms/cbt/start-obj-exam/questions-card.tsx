import { Card, CardContent } from "@/components/ui/card";
import { Dispatch, MutableRefObject, SetStateAction, useCallback } from "react";
import { SanitizedQuestion } from "../../../../../types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ExamSubmissionTriggerTypeEnum } from "@/api/enums/ExamSubmissionTriggerTypeEnum";
import { useForm, UseFormWatch } from "react-hook-form";
import SubmitButton from "@/components/buttons/SubmitButton";
import TimerBadge from "./timer-badge";

interface Questions {
  subjectName: string;
  handleSubmit: ReturnType<typeof useForm>["handleSubmit"];
  handleFinalSubmit: (triggerType: ExamSubmissionTriggerTypeEnum) => void;
  timeLeft: number;
  timeAllocated: number;
  currentPageQuestions: SanitizedQuestion[];
  handleOptionChange: (questionId: string, value: string) => void;
  watch: UseFormWatch<{
    answers: Record<string, string>;
  }>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  PAGE_SIZE: number;
  questions: SanitizedQuestion[];
  isSubmitting: boolean;
  hasSubmittedRef: MutableRefObject<boolean>;
  isLoadingObjExams: boolean;
  setShowIncompleteDialog: Dispatch<SetStateAction<boolean>>;
  setUnansweredQuestions: Dispatch<SetStateAction<any[]>>;
}
export default function QuestionsCard({
  subjectName,
  handleSubmit,
  handleFinalSubmit,
  timeLeft,
  timeAllocated,
  currentPageQuestions,
  handleOptionChange,
  watch,
  page,
  setPage,
  PAGE_SIZE,
  questions,
  isSubmitting,
  hasSubmittedRef,
  isLoadingObjExams,
  setShowIncompleteDialog,
  setUnansweredQuestions,
}: Questions) {
  const manualSubmit = useCallback(() => {
    const answers = watch("answers");

    const unanswered = questions.filter((q) => !answers[q._id]);

    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
      setShowIncompleteDialog(true);
    } else {
      handleFinalSubmit(ExamSubmissionTriggerTypeEnum.MANUAL);
    }
  }, [handleFinalSubmit, questions, setShowIncompleteDialog, setUnansweredQuestions, watch]);

  const totalPages = Math.ceil(questions.length / PAGE_SIZE);
  const isLastPage = page === totalPages - 1;

  return (
    <Card className="h-auto w-full shadow-md lg:mt-10">
      <CardContent className="space-y-4 p-6">
        <h2 className="text-center text-lg font-semibold uppercase lg:text-xl">
          Questions Navigation Panel
        </h2>

        <Separator />

        <div className="relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(manualSubmit)();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className="mx-auto max-w-4xl py-0 lg:py-6"
          >
            <div className="mb-4 flex items-center justify-between gap-4">
              <h1 className="text-lg font-semibold capitalize lg:text-xl">
                {subjectName} Objective Exam
              </h1>
              <TimerBadge timeLeft={timeLeft} totalTime={timeAllocated} />
            </div>

            <Card>
              <CardContent className="space-y-6 p-4 sm:p-6">
                {currentPageQuestions.map((q) => (
                  <div key={q._id} className="space-y-3">
                    <div className="font-medium md:text-lg lg:text-xl">
                      {q.question_shuffled_number}.{" "}
                      <span className="capitalize">{q.question_text}</span>
                    </div>
                    <RadioGroup
                      onValueChange={(val) => handleOptionChange(q._id, val)}
                      value={watch(`answers.${q._id}`) || ""}
                    >
                      {q.options.map((opt: string, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <RadioGroupItem value={opt} id={`${q._id}-${idx}`} />
                          <Label
                            htmlFor={`${q._id}-${idx}`}
                            className="text-sm capitalize lg:text-base"
                          >
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    <Separator className="my-4" />
                  </div>
                ))}

                <div className="flex flex-wrap justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>

                  {isLastPage && (
                    <SubmitButton
                      loading={isSubmitting}
                      type="submit"
                      text="Submit Exam"
                      disabled={isSubmitting || hasSubmittedRef.current}
                    />
                  )}

                  {!isLastPage && (
                    <Button
                      type="button"
                      disabled={isLoadingObjExams}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
