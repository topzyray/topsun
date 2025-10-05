"use client";

import { useEffect, useMemo, useState } from "react";
import { SocketIOService } from "@/api/services/SocketIOService";
import { useCustomQuery } from "../queries/use-query.hook";
import { CbtApiService } from "@/api/services/CbtApiService";
import { OBJExamQuestion, Student } from "../../../../types";

type UseExamAccessGuardOptions = {
  subjectId: string;
  sessionId: string;
  term: string;
  student: Student;
  accessToken: string;
  isSocketConnected: boolean;
};

export function useExamAccessGuard({
  subjectId,
  sessionId,
  term,
  student,
  accessToken,
  isSocketConnected,
}: UseExamAccessGuardOptions) {
  const [examData, setExamData] = useState<OBJExamQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [socketError, setSocketError] = useState<string | null>(null);

  const hasBasicAccess = useMemo(() => {
    return !!subjectId && !!student?.current_class?.class_id?._id && student?.role === "student";
  }, [subjectId, student]);

  const {
    data: fallbackExamData,
    isLoading: isLoadingFallback,
    isError: isFallbackError,
    error: fallbackError,
  } = useCustomQuery(
    ["fallbackExamData", subjectId],
    () =>
      CbtApiService.startSubjectCbtObjCbtAssessmentForAClass({
        subject_id: subjectId,
        academic_session_id: sessionId,
        class_id: student?.current_class?.class_id?._id,
        term,
      }),
    {},
    hasBasicAccess &&
      sessionId !== undefined &&
      term !== undefined &&
      !examData &&
      !isSocketConnected, // only run if no socket data
  );

  // Primary: Socket fetch
  useEffect(() => {
    const fetchViaSocket = async () => {
      if (!hasBasicAccess || !SocketIOService.isSocketConnected()) {
        return;
      }

      try {
        const result = await SocketIOService.startExam({
          accessToken,
          subject_id: subjectId,
          academic_session_id: sessionId,
          class_id: student?.current_class?.class_id?._id,
          term,
        });

        if (result?.data) {
          setExamData(result.data);
          setLoading(false);
        } else {
          setSocketError(result?.message || "Unknown socket error");
          setLoading(false);
        }
      } catch (err: any) {
        setSocketError(err.message || "Socket connection failed");
        setLoading(false);
      }
      // } finally {
      //   setLoading(false);
      // }
    };

    fetchViaSocket();
  }, [hasBasicAccess, accessToken, subjectId, sessionId, student, term]);

  // Use fallback REST data if socket failed or not connected
  useEffect(() => {
    if (!examData && fallbackExamData?.questions) {
      setExamData(fallbackExamData.questions);
      setLoading(false);
    }
  }, [fallbackExamData, examData]);

  useEffect(() => {
    if (!examData && !isLoadingFallback && (socketError || isFallbackError)) {
      setLoading(false);
    }
  }, [examData, isLoadingFallback, socketError, isFallbackError]);

  const timeLeft = examData?.others?.obj_time_left ?? 0;
  const hasAccess = hasBasicAccess && !socketError && !isFallbackError && timeLeft > 0;

  const finalError = socketError || fallbackError;

  return {
    examData,
    loading: loading || isLoadingFallback,
    isError: !!finalError,
    error: finalError,
    hasAccess,
  };
}
