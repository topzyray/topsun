"use client";

import { Separator } from "@/components/ui/separator";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { SubjectApiService } from "@/api/services/SubjectApiService";
import { Subject } from "../../../../../types";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import BackButton from "@/components/buttons/BackButton";
import { TextHelper } from "@/helpers/TextHelper";

export default function SubjectDetails({ params }: { params: Record<string, any> }) {
  // Handle subject data fetching
  let { data, isLoading, isError, error } = useCustomQuery(
    ["subjectById"],
    () => SubjectApiService.getASubjectById(params.subject_id),
    { id: params.subject_id },
  );

  let subjectData: Subject = data?.subject !== undefined && data?.subject;

  return (
    <div className="space-y-4">
      <BackButton />

      <Separator />
      <h1 className="text-lg uppercase">Subject Details Page</h1>
      <Separator />

      {isLoading && <CircularLoader text="Fetching subject details" />}

      {subjectData && subjectData !== null && (
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex w-full flex-col gap-4 lg:flex-row">
            <div className="w-full space-y-3 rounded border p-4 lg:w-1/2">
              <h2>Subject Details</h2>
              <Separator />
              <div className="bg-sidebar w-full space-y-2 p-2">
                <div className="flex justify-between gap-4 text-sm">
                  <span>ID:</span>
                  <span className="text-wrap">{subjectData?._id} </span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span>Name:</span>
                  <span>{TextHelper.capitalize(subjectData?.name)}</span>
                </div>
                <div className="flex justify-between gap-4 text-sm">
                  <span>Description:</span>
                  <span className="text-right text-wrap">
                    {TextHelper.capitalize(subjectData?.description)}
                  </span>
                </div>

                <div className="flex justify-between gap-4 text-sm">
                  <span>Date Created:</span>
                  <span>{TextHelper.getFormattedDate(subjectData?.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* <div className="p-4 rounded w-full lg:w-1/2 space-y-3 border">
              <h2>Subject Section Details</h2>
              <Separator />
              {subjectData?.sections.length > 0 && (
                <div className="bg-sidebar p-2 space-y-3">
                  {subjectData?.sections.map((item) => {
                    return (
                      <Fragment key={item._id}>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm flex justify-between">
                              <span>Tier:</span>
                              <span className="capitalize">{item.tier}</span>
                            </div>

                            <div className="text-sm flex justify-between">
                              <span>Status:</span>
                              <span
                                className={`${
                                  item.is_compulsory
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {item.is_compulsory
                                  ? "Compulsory"
                                  : "Not compulsory"}
                              </span>
                            </div>
                          </div>
                          <Separator />
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              )}
              {subjectData?.sections.length === 0 && (
                <p className="text-sm">No section details provided.</p>
              )}
            </div> */}
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
