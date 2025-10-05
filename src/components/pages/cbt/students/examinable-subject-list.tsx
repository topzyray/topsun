"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GlobalContext } from "@/providers/global-state-provider";
import { Separator } from "@/components/ui/separator";
import ErrorBox from "@/components/atoms/error-box";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { TextHelper } from "@/helpers/TextHelper";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { ScheduledTimetableSubject, Student } from "../../../../../types";
import { ExamStatusTypeEnum } from "@/api/enums/ExamStatusTypeEnum";

export default function ExaminableSubjects() {
  const { examTimetable } = useContext(GlobalContext);
  const { userDetails } = useAuth();
  const student = (userDetails as Student) ?? {};
  const router = useRouter();

  const handleAction = (subjectId: string) => {
    router.push(`start/${subjectId}`);
  };

  const renderButton = (timetable: ScheduledTimetableSubject) => {
    const isAuthorized = timetable?.authorized_students?.includes(student?._id as never);
    const hasStarted = timetable?.students_that_have_started?.includes(student?._id as never);
    const hasSubmitted = timetable?.students_that_have_submitted?.includes(student?._id as never);

    const isQuestionReady = timetable?.is_subject_question_set;
    const examStatus = timetable?.exam_subject_status;

    const canStart = isAuthorized && isQuestionReady && examStatus === ExamStatusTypeEnum.ONGOING;
    const canResume = isAuthorized && hasStarted && examStatus === ExamStatusTypeEnum.ONGOING;
    const notCompleted = isAuthorized && hasStarted && examStatus === ExamStatusTypeEnum.ENDED;

    let buttonLabel = "Not Available";
    let buttonVariant: "success" | "destructive" | "secondary" | "outline" | "warning" =
      "destructive";
    let disabled = true;

    if (canResume) {
      buttonLabel = "Resume Exam";
      buttonVariant = "success";
      disabled = false;
    }

    if (canStart) {
      buttonLabel = "Start Exam";
      buttonVariant = "success";
      disabled = false;
    }

    if (hasSubmitted) {
      buttonLabel = "Already Submitted";
      buttonVariant = "outline";
      disabled = true;
    }

    if (notCompleted) {
      buttonLabel = "Missed";
      buttonVariant = "destructive";
      disabled = true;
    }

    return (
      <Button
        onClick={() => handleAction(timetable?.subject_id?._id)}
        size="sm"
        variant={buttonVariant}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
    );
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mt-5 w-full max-w-4xl py-12 shadow-md lg:mt-10 lg:py-18">
        <CardContent className="p-4">
          <div className="space-y-6 lg:px-10">
            <h1 className="flex items-center justify-center gap-2 text-center text-2xl font-bold uppercase lg:text-4xl">
              <span>📚 Examinable Subjects</span>
              {examTimetable?.data?.scheduled_subjects && (
                <Button size="sm" variant="success" className="text-lg lg:text-xl">
                  {examTimetable?.data?.scheduled_subjects.length}
                </Button>
              )}
            </h1>

            <Separator />

            <p className="text-sm sm:text-lg lg:text-xl">
              Select a subject to start, continue, or review your exam.
            </p>

            <div className="h-full max-h-[20rem] overflow-auto">
              {examTimetable?.loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-md" />
                  ))}
                </div>
              ) : examTimetable?.data?.scheduled_subjects?.length ? (
                <div className="space-y-4">
                  {examTimetable.data.scheduled_subjects.map(
                    (timetable: ScheduledTimetableSubject) => {
                      const examStatus = timetable?.exam_subject_status;
                      const badgeVariant =
                        examStatus === ExamStatusTypeEnum.NOT_STARTED
                          ? "default"
                          : examStatus === ExamStatusTypeEnum.SUBMITTED
                            ? "secondary"
                            : examStatus === ExamStatusTypeEnum.ONGOING
                              ? "success"
                              : "destructive";

                      return (
                        <div
                          key={timetable._id}
                          className="flex items-center justify-between rounded-md border p-4"
                        >
                          <div>
                            <h2 className="space-x-2 font-semibold capitalize">
                              <span className="lg:text-lg">{timetable?.subject_id?.name}</span>
                              <Badge variant={badgeVariant}>{examStatus?.replace(/_/g, " ")}</Badge>
                            </h2>
                            <p className="text-muted-foreground text-sm lg:text-base">
                              {TextHelper.getFormattedDate(timetable?.start_time)} &bull;{" "}
                              {TextHelper.getFormattedTime(timetable?.start_time)}
                            </p>
                            <p className="text-muted-foreground text-sm lg:text-base">
                              {TextHelper.getFormattedDuration(timetable?.duration)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">{renderButton(timetable)}</div>
                        </div>
                      );
                    },
                  )}
                </div>
              ) : examTimetable?.error ? (
                <ErrorBox error={examTimetable?.error} />
              ) : (
                <div>
                  <CircularLoader text="Please wait" />
                </div>
              )}
            </div>

            <Separator />
            <div className="mx-auto space-y-4 pt-4">
              <Button onClick={() => router.back()}>Back</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
