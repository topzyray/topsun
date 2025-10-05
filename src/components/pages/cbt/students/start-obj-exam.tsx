"use client";

import debounce from "lodash/debounce";
import toast from "react-hot-toast";
import { throttle } from "lodash";
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import QuestionNavigation from "../../../atoms/cbt/start-obj-exam/questions-navigation";
import QuestionsCard from "@/components/atoms/cbt/start-obj-exam/questions-card";
import QuestionsMetadata from "@/components/atoms/cbt/start-obj-exam/question-metadata";
import QuestionNavTriggerForMobile from "@/components/atoms/cbt/start-obj-exam/question-nav-trigger-mobile";
import IncompleteSubmissionDialog from "@/components/modals/incomplete-submission-dialog";
import SubmissionSuccessCard from "@/components/atoms/cbt/start-obj-exam/submission-success-card";
import { GlobalContext } from "@/providers/global-state-provider";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useExamAccessGuard } from "@/api/hooks/guards/use-exam-access-guard.hook";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { TextHelper } from "@/helpers/TextHelper";
import { CbtApiService } from "@/api/services/CbtApiService";
import { SocketIOService } from "@/api/services/SocketIOService";
import { STORE_KEYS } from "@/configs/store.config";
import { ExamSubmissionTriggerTypeEnum } from "@/api/enums/ExamSubmissionTriggerTypeEnum";
import { ExamQuestionMetadata, SanitizedQuestion, Student } from "../../../../../types";
import { useSidebar } from "@/components/ui/sidebar";
import { useSocketLifecycle } from "@/api/hooks/use-socket-lifecyle.hook";

const PAGE_SIZE = 1;
const AUTO_SAVE_TIME = 2000;
const AUTO_RUN_FINAL_SUBMIT = 1000;
const REDIRECT_DELAY = 5;

const questionSchema = z.object({
  answers: z.record(z.string().min(1, "Please select an answer")),
});

export default function StartOBJExam({ params }: { params: Record<string, string> }) {
  const [questions, setQuestions] = useState<SanitizedQuestion[]>([]);
  const [examId, setExamId] = useState<string>("");
  const [cbtResultId, setCbtResultId] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [page, setPage] = useState(0);
  const [metadata, setMetadata] = useState<ExamQuestionMetadata | null>(null);
  const [showOnlyUnanswered, setShowOnlyUnanswered] = useState(false);
  const [showIncompleteDialog, setShowIncompleteDialog] = useState(false);
  const [unansweredQuestions, setUnansweredQuestions] = useState<SanitizedQuestion[]>([]);
  const [showSubmissionConfirmation, setShowSubmissionConfirmation] = useState(false);
  const [isSubmittingOBJExamSocket, setIsSubmittingOBJExamSocket] = useState(false);

  const timeLeftRef = useRef(0);
  const timeSyncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeAlertShownRef = useRef<{ [key: number]: boolean }>({});
  const hasSubmittedRef = useRef(false);
  const cutoffTimeRef = useRef<number | null>(null);

  const { setOpen } = useSidebar();
  const { activeSessionData } = useContext(GlobalContext);
  const { userDetails } = useAuth();
  const student = (userDetails as Student) ?? {};
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  const { handleSubmit, watch, setValue, getValues } = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      answers: {},
    },
  });

  const answers = watch("answers");

  const hydrateExamState = useCallback(
    (data: { sanitizedQuestions: SanitizedQuestion[]; others: ExamQuestionMetadata }) => {
      const saved: Record<string, string> = {};
      data?.sanitizedQuestions.forEach((q: SanitizedQuestion) => {
        if (q?.selected_answer) {
          saved[q._id] = q.selected_answer;
        }
      });
      setQuestions(data?.sanitizedQuestions);

      const time = data?.others?.obj_time_left;
      setTimeLeft(time);
      timeLeftRef.current = time;

      const finalCutoffTime = data?.others?.obj_final_cutoff_time;
      cutoffTimeRef.current = finalCutoffTime ? new Date(finalCutoffTime).getTime() : null;

      setExamId(data?.others?.exam_id);
      setCbtResultId(data?.others?._id);
      setMetadata(data?.others);
      setValue("answers", saved);
    },
    [setValue],
  );

  const storedData = StorageUtilsHelper.getItemsFromLocalStorage([STORE_KEYS.USER_ACCESS_TOKEN]);
  const accessToken = storedData[STORE_KEYS.USER_ACCESS_TOKEN];

  const { isSocketConnected } = useSocketLifecycle();

  const {
    examData,
    loading: isLoadingObjExams,
    isError: isObjExamsError,
    error: objExamsError,
    hasAccess,
  } = useExamAccessGuard({
    subjectId: params?.subject_id,
    sessionId: activeSessionData?.activeSession?._id as string,
    term: activeSessionData?.activeTerm?.name as string,
    student,
    accessToken: accessToken as string,
    isSocketConnected,
  });

  useEffect(() => {
    if (examData && !hasSubmittedRef.current) {
      hydrateExamState(examData);
      hasSubmittedRef.current = false;
      queryClient.invalidateQueries({ queryKey: ["timetable"] });
    }
  }, [examData, hydrateExamState, queryClient]);

  const { mutate: updateExamTimeREST } = useCustomMutation(
    CbtApiService.updateSubjectCbtObjExamRemainingTimeForAClassInASchool,
    {
      onErrorCallback: (error) => {
        toast.error(TextHelper.capitalize(extractErrorMessage(error)));
      },
      retry: 3,
      retryDelay: 1000,
      toastStatusMessage: false,
    },
  );

  const syncTimeToBackend = useCallback(async () => {
    if (hasSubmittedRef.current || !cbtResultId || !examId || timeLeftRef.current <= 0) return;

    if (isSocketConnected) {
      await SocketIOService.updateRemainingTime({
        accessToken,
        exam_id: examId,
        cbt_result_id: cbtResultId,
        remaining_time: timeLeftRef.current,
      });
    } else {
      updateExamTimeREST({
        requestBody: {
          remaining_time: timeLeftRef.current,
        },
        params: {
          cbt_result_id: cbtResultId,
          exam_id: examId,
        },
      });
    }
  }, [accessToken, cbtResultId, examId, isSocketConnected, updateExamTimeREST]);

  const { mutate: saveOBJExamProgress } = useCustomMutation(
    CbtApiService.updateSubjectCbtObjExamForAClassInASchool,
    {
      onErrorCallback: (error) => {
        console.error("Save progress failed!", error);
      },
      toastStatusMessage: false,
    },
  );

  const saveProgress = useCallback(async () => {
    if (hasSubmittedRef.current || !questions.length || !examId || !cbtResultId) return;

    const data = getValues();
    const selectedAnswers = Object.entries(data.answers).map(([id, answer]) => ({
      _id: id,
      selected_answer: answer,
    }));

    if (!selectedAnswers.length) return;

    if (isSocketConnected) {
      await SocketIOService.updateAnswer({
        accessToken,
        result_doc: selectedAnswers,
        cbt_result_id: cbtResultId,
        exam_id: examId,
      });
    } else {
      saveOBJExamProgress({
        requestBody: {
          result_doc: selectedAnswers,
        },
        params: {
          cbt_result_id: cbtResultId,
          exam_id: examId,
        },
      });
    }
  }, [
    accessToken,
    cbtResultId,
    examId,
    getValues,
    isSocketConnected,
    questions,
    saveOBJExamProgress,
  ]);

  useEffect(() => {
    if (hasSubmittedRef.current) return;

    timeSyncIntervalRef.current = setInterval(() => {
      syncTimeToBackend();
    }, AUTO_SAVE_TIME);

    return () => {
      if (timeSyncIntervalRef.current) {
        clearInterval(timeSyncIntervalRef.current);
      }
    };
  }, [syncTimeToBackend]);

  const throttledSaveProgress = useMemo(
    () => throttle(saveProgress, 5000), // call max once per 5s
    [saveProgress],
  );

  const throttledSaveProgressRef = useRef(throttledSaveProgress);

  useEffect(() => {
    throttledSaveProgressRef.current = throttledSaveProgress;
  }, [throttledSaveProgress]);

  const handleOptionChange = useCallback(
    async (questionId: string, value: string) => {
      setValue(`answers.${questionId}`, value, { shouldDirty: true });
      throttledSaveProgress();
    },

    [setValue, throttledSaveProgress],
  );

  const submitOBJExamSocket = useCallback(
    async (data: unknown) => {
      setIsSubmittingOBJExamSocket(true);
      try {
        const response = await SocketIOService.submitExam(data);
        if (response.status === "success") {
          hasSubmittedRef.current = true;
          throttledSaveProgressRef.current?.cancel?.();
          setIsSubmittingOBJExamSocket(false);

          queryClient.removeQueries({ queryKey: ["OBJQuestions"] });
          queryClient.invalidateQueries({ queryKey: ["timetable"] });
          queryClient.invalidateQueries({ queryKey: ["students"] });
          queryClient.invalidateQueries({ queryKey: ["results"] });
          queryClient.invalidateQueries({ queryKey: ["scores"] });
          queryClient.invalidateQueries({
            queryKey: [student?.current_class?.class_id?._id],
          });
          queryClient.invalidateQueries({ queryKey: [params?.subject_id] });

          StorageUtilsHelper.saveToLocalStorage([
            STORE_KEYS.OBJ_EXAM_RESULT,
            {
              data: response.data,
            },
          ]);

          if (showIncompleteDialog) {
            setShowIncompleteDialog(false);
          }

          if (timeSyncIntervalRef.current) {
            clearInterval(timeSyncIntervalRef.current);
            timeSyncIntervalRef.current = null;
          }

          setShowSubmissionConfirmation(true);
        } else {
          hasSubmittedRef.current = false;
          setIsSubmittingOBJExamSocket(false);
        }
      } catch (error) {
        hasSubmittedRef.current = false;
        setIsSubmittingOBJExamSocket(false);
      }
    },
    [params?.subject_id, queryClient, showIncompleteDialog, student?.current_class?.class_id?._id],
  );

  const { mutate: submitOBJExamREST, isPending: isSubmittingOBJExamREST } = useCustomMutation(
    CbtApiService.submitSubjectCbtObjExamForAClassInASchool,
    {
      onSuccessCallback: (data) => {
        hasSubmittedRef.current = true;
        throttledSaveProgressRef.current?.cancel?.();

        queryClient.removeQueries({ queryKey: ["OBJQuestions"] });
        queryClient.invalidateQueries({ queryKey: ["timetable"] });
        queryClient.invalidateQueries({ queryKey: ["students"] });
        queryClient.invalidateQueries({ queryKey: ["results"] });
        queryClient.invalidateQueries({ queryKey: ["scores"] });
        queryClient.invalidateQueries({
          queryKey: [student?.current_class?.class_id?._id],
        });
        queryClient.invalidateQueries({ queryKey: [params?.subject_id] });

        StorageUtilsHelper.saveToLocalStorage([
          STORE_KEYS.OBJ_EXAM_RESULT,
          {
            data: data?.questions,
          },
        ]);

        if (showIncompleteDialog) {
          setShowIncompleteDialog(false);
        }

        if (timeSyncIntervalRef.current) {
          clearInterval(timeSyncIntervalRef.current);
          timeSyncIntervalRef.current = null;
        }

        setShowSubmissionConfirmation(true);
      },
      onErrorCallback: () => {
        hasSubmittedRef.current = false;
      },
    },
  );

  const proceedWithSubmission = useCallback(
    async (trigger_type: ExamSubmissionTriggerTypeEnum) => {
      if (hasSubmittedRef.current) return;

      const data = getValues();
      const submittedQuestions = questions.map((q) => ({
        ...q,
        selected_answer: data.answers[q._id] || null,
      }));

      if (isSocketConnected) {
        await submitOBJExamSocket({
          accessToken,
          cbt_result_id: cbtResultId,
          exam_id: examId,
          result_doc: {
            sanitizedQuestions: submittedQuestions,
            obj_time_left: timeLeftRef.current,
            obj_total_time_allocated: metadata?.obj_total_time_allocated,
          },
          trigger_type: trigger_type,
        });
      } else {
        submitOBJExamREST({
          requestBody: {
            result_doc: {
              sanitizedQuestions: submittedQuestions as {
                selected_answer: string;
                question_shuffled_number: number;
                question_text: string;
                options: string[];
                _id: string;
              }[],
              obj_time_left: timeLeftRef.current,
              obj_total_time_allocated: metadata?.obj_total_time_allocated as number,
            },
            trigger_type: trigger_type,
          },
          params: {
            cbt_result_id: cbtResultId,
            exam_id: examId,
          },
        });
      }
    },
    [
      accessToken,
      cbtResultId,
      examId,
      getValues,
      isSocketConnected,
      metadata?.obj_total_time_allocated,
      questions,
      submitOBJExamREST,
      submitOBJExamSocket,
    ],
  );

  const handleFinalSubmit = useMemo(() => {
    return debounce(
      async (trigger_type: ExamSubmissionTriggerTypeEnum, forceSubmit: boolean = false) => {
        if (!questions.length || !examId || !cbtResultId || !metadata) return;

        const data = getValues();
        const unanswered = questions.filter((q) => !data.answers[q._id]);

        if (unanswered.length > 0 && !forceSubmit) {
          if (trigger_type === ExamSubmissionTriggerTypeEnum.TIME_UP) {
            proceedWithSubmission(trigger_type);
            toast.success("Time's up 🕒! Your exam has been automatically submitted.");
          } else {
            setUnansweredQuestions(unanswered);
            setTimeout(() => setShowIncompleteDialog(true), 50);
          }
          return;
        }

        proceedWithSubmission(trigger_type);
      },
      500,
    );
  }, [cbtResultId, examId, getValues, metadata, proceedWithSubmission, questions]);

  const handleFinalSubmitRef = useRef(handleFinalSubmit);

  useEffect(() => {
    handleFinalSubmitRef.current = handleFinalSubmit;
  }, [handleFinalSubmit]);

  useEffect(() => {
    return () => {
      handleFinalSubmit.cancel();
    };
  }, [handleFinalSubmit]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      const now = Date.now();

      // Auto-submit if cutoff time has passed
      if (cutoffTimeRef.current && now >= cutoffTimeRef.current && !hasSubmittedRef.current) {
        handleFinalSubmitRef.current(ExamSubmissionTriggerTypeEnum.TIME_CUTOFF_REACHED, true);
        toast.error("⏰ Exam has ended due to final cutoff time. Auto-submitting.");
        clearInterval(timerId);
        return;
      }

      // Reduce local time left
      const newTime = Math.max(timeLeftRef.current - 1, 0);
      timeLeftRef.current = newTime;
      setTimeLeft(newTime);

      if (!hasSubmittedRef.current) {
        if (newTime <= 300 && !timeAlertShownRef.current[300]) {
          toast.error("⚠️ You have 5 minutes left!", {
            id: "five-mins-warning",
          });
          timeAlertShownRef.current[300] = true;
        }

        if (newTime <= 180 && !timeAlertShownRef.current[180]) {
          toast.error("⏰ Only 3 minutes left. Wrap up your answers!", {
            id: "three-mins-warning",
          });
          timeAlertShownRef.current[180] = true;
        }

        if (newTime === 0) {
          handleFinalSubmitRef.current(ExamSubmissionTriggerTypeEnum.TIME_UP);
        }
      }
    }, AUTO_RUN_FINAL_SUBMIT);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const filteredQuestions = useMemo(() => {
    return showOnlyUnanswered ? questions.filter((q) => !answers[q._id]) : questions;
  }, [questions, showOnlyUnanswered, answers]);

  useEffect(() => {
    setPage(0);
  }, [showOnlyUnanswered, filteredQuestions]);

  useEffect(() => {
    if (page * PAGE_SIZE >= filteredQuestions.length && page !== 0) {
      setPage(Math.max(Math.floor(filteredQuestions.length / PAGE_SIZE) - 1, 0));
    }
  }, [filteredQuestions.length, page]);

  const currentPageQuestions = filteredQuestions.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  const getQuestionStatus = useCallback(
    (id: string) => {
      return answers?.[id] ? "answered" : "unanswered";
    },
    [answers],
  );

  // Prompt on data loss on tab close before exam submission
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const answers = getValues();
      const isAnswered = Object.keys(answers?.answers || {}).length > 0;

      if (!hasSubmittedRef.current && isAnswered) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [getValues]);

  // Guard exam access here before render
  useEffect(() => {
    if (hasSubmittedRef.current) return;

    if (!isLoadingObjExams && !hasAccess) {
      if (isObjExamsError) {
        toast.error(TextHelper.capitalize(extractErrorMessage(objExamsError)));
      } else {
        toast.error("Something went wrong. Contact your school!");
      }
      router.replace("/dashboard/student/cbt/subjects");
    }
  }, [hasAccess, isObjExamsError, isLoadingObjExams, objExamsError, router]);

  if (isLoadingObjExams) {
    return (
      <>
        <div className="mt-32 flex h-full items-center justify-center lg:mt-40">
          <CircularLoader text="Checking your exam access..." rollerClassName="w-16 h-16" />
        </div>
      </>
    );
  }

  return (
    <div className="h-full w-full">
      <Card className="mt-5 w-full py-12 shadow-md lg:mt-10 lg:py-18">
        <CardContent>
          <div className="space-y-6 lg:px-10">
            <h1 className="text-center text-2xl font-bold uppercase lg:text-4xl">
              📝 Examination Page
            </h1>

            <Separator />
            <div>
              {isLoadingObjExams ? (
                <div className="flex h-full w-full gap-4">
                  <Skeleton className="h-[15rem] w-full max-w-sm rounded-md" />
                  <Skeleton className="h-[15rem] w-full rounded-md" />
                  <Skeleton className="h-[15rem] w-full max-w-sm rounded-md" />
                </div>
              ) : currentPageQuestions.length > 0 ? (
                <div className="flex flex-col gap-6">
                  <div className="flex w-full justify-around gap-4">
                    {showSubmissionConfirmation ? (
                      <SubmissionSuccessCard
                        initialCountdown={REDIRECT_DELAY}
                        buttonText="Go to Summary"
                      />
                    ) : (
                      <>
                        <QuestionsMetadata
                          metaData={{
                            ...(metadata as ExamQuestionMetadata),
                            total_questions: questions.length,
                            time_left: timeLeftRef.current,
                          }}
                        />

                        <QuestionsCard
                          subjectName={metadata?.subject_id?.name as string}
                          handleSubmit={handleSubmit}
                          handleFinalSubmit={handleFinalSubmit}
                          timeLeft={timeLeftRef.current}
                          timeAllocated={metadata?.obj_total_time_allocated as number}
                          currentPageQuestions={currentPageQuestions}
                          handleOptionChange={handleOptionChange}
                          watch={watch}
                          page={page}
                          setPage={setPage}
                          PAGE_SIZE={PAGE_SIZE}
                          questions={filteredQuestions}
                          isSubmitting={isSubmittingOBJExamSocket || isSubmittingOBJExamREST}
                          hasSubmittedRef={hasSubmittedRef}
                          isLoadingObjExams={isLoadingObjExams}
                          setShowIncompleteDialog={setShowIncompleteDialog}
                          setUnansweredQuestions={setUnansweredQuestions}
                        />

                        <QuestionNavigation
                          getQuestionStatus={getQuestionStatus}
                          PAGE_SIZE={PAGE_SIZE}
                          page={page}
                          setPage={setPage}
                          questions={filteredQuestions}
                          showOnlyUnanswered={showOnlyUnanswered}
                          setShowOnlyUnanswered={setShowOnlyUnanswered}
                        />
                      </>
                    )}
                  </div>

                  <div className="flex w-full justify-between">
                    <QuestionNavTriggerForMobile trigger="Navigation" title="Question Navigation">
                      <QuestionNavigation
                        getQuestionStatus={getQuestionStatus}
                        PAGE_SIZE={PAGE_SIZE}
                        page={page}
                        setPage={setPage}
                        questions={filteredQuestions}
                        showOnlyUnanswered={showOnlyUnanswered}
                        setShowOnlyUnanswered={setShowOnlyUnanswered}
                        className="top-20 block w-full max-w-sm py-6 shadow-md"
                      />
                    </QuestionNavTriggerForMobile>

                    <QuestionNavTriggerForMobile trigger="Exam Data" title="Exam Metadata">
                      <QuestionsMetadata
                        metaData={{
                          ...(metadata as ExamQuestionMetadata),
                          total_questions: questions.length,
                          time_left: timeLeft,
                        }}
                        className="top-20 block w-full max-w-sm py-6 shadow-md"
                      />
                    </QuestionNavTriggerForMobile>
                  </div>

                  <IncompleteSubmissionDialog
                    open={showIncompleteDialog}
                    onClose={() => setShowIncompleteDialog(false)}
                    isSubmitting={isSubmittingOBJExamSocket || isSubmittingOBJExamREST}
                    hasSubmittedRef={hasSubmittedRef}
                    onSubmitAnyway={() => {
                      handleFinalSubmitRef.current(ExamSubmissionTriggerTypeEnum.MANUAL, true);
                    }}
                    unansweredQuestions={unansweredQuestions}
                    allQuestions={questions}
                    goToQuestion={(questionId: string) => {
                      const index = questions.findIndex((q) => q._id === questionId);
                      setPage(Math.floor(index / PAGE_SIZE));
                    }}
                  />
                </div>
              ) : isObjExamsError ? null : (
                <CircularLoader text="Please wait" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
