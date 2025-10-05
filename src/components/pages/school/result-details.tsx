"use client";

import { Separator } from "@/components/ui/separator";
import React, { useEffect } from "react";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import BackButton from "@/components/buttons/BackButton";
import { ResultApiService } from "@/api/services/ResultApiService";
import { ResultCard } from "./result-card";
import { useAuth } from "@/api/hooks/use-auth.hook";

export default function ResultDetails({ params }: { params: Record<string, string> }) {
  const { userDetails } = useAuth();

  useEffect(() => {
    if (userDetails?.role === "student") {
      params.student_id = userDetails?._id;
    }
  }, [params, userDetails?._id, userDetails?.role]);

  const { data, isLoading, isError, error } = useCustomQuery(
    ["classById"],
    () =>
      ResultApiService.getStudentResultByResultIdInASchool({
        result_id: params.result_id,
        student_id: params?.student_id,
      }),
    { id: [params.result_id, params?.student_id] },
  );

  const resultData: ResultCard = data?.result !== undefined && data?.result;

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Result Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching result details" />}

      {resultData && resultData !== null && (
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex w-full gap-4">
            <ResultCard result_data={resultData} />
          </div>
        </div>
      )}

      {isError && (
        <div className="bg-sidebar max-w-md space-y-3 rounded p-6 text-red-600">
          <p>{extractErrorMessage(error)}</p>
        </div>
      )}
    </div>
  );
}
