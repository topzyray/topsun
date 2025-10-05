"use client";

import { useAuth } from "@/api/hooks/use-auth.hook";
import { Teacher } from "../../../../types";
import ClassCardComponent from "../../cards/class-card";
import { Separator } from "../../ui/separator";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import { CircularLoader } from "../../loaders/page-level-loader";
import ErrorBox from "@/components/atoms/error-box";
import BackButton from "@/components/buttons/BackButton";

export default function ClassManaging() {
  const { userDetails } = useAuth();
  const teacher = userDetails as Teacher;

  const { data, isLoading, isError, error } = useCustomQuery(["class_managing"], () =>
    TeacherApiService.getClassTeacherManages({ teacher_id: teacher._id }),
  );

  const class_managing_data = data?.class_am_managing ?? null;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>

        <Separator />

        <div className="">
          <h1 className="text-lg uppercase">Classes Management Page</h1>
        </div>

        <Separator />
        <div className="mx-auto w-full max-w-4xl sm:p-4">
          <div className="flex w-full flex-wrap items-center justify-center gap-4">
            {isLoading ? (
              <CircularLoader text="Loading teacher class data" />
            ) : class_managing_data !== null ? (
              <ClassCardComponent action_from="class_teacher" data={class_managing_data} />
            ) : isError ? (
              <ErrorBox error={error} />
            ) : (
              <div className="border p-6">
                <p>No class assigned yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
