"use client";

import { useAuth } from "@/api/hooks/use-auth.hook";
import { Class, Student, Subject, Teacher } from "../../../../types";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { CircularLoader } from "../../loaders/page-level-loader";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import { TeacherApiService } from "@/api/services/TeacherApiService";
import ClassCardComponent from "../../cards/class-card";
import { Separator } from "../../ui/separator";
import BackButton from "@/components/buttons/BackButton";

export default function TeacherClasses() {
  const { userDetails } = useAuth();
  const teacher = userDetails as Teacher;

  let { data, isLoading, isError, error } = useCustomQuery(["teachers", "teacherById"], () =>
    TeacherApiService.getAllClassesTeacherTeachesByTeacherId({
      params: {
        teacher_id: teacher._id,
      },
    }),
  );

  let classes: { class_id: Class; students: Student[]; subject: Subject }[] =
    data?.classes && data?.classes;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>

        <Separator />

        <div>
          <h1 className="text-lg uppercase">My Classes Page</h1>
        </div>
        <Separator />
        <div className="mx-auto flex w-full max-w-4xl flex-wrap justify-center gap-4">
          {isLoading ? (
            <CircularLoader text="Loading class data" />
          ) : classes && classes.length > 0 ? (
            classes.map((item, index) => (
              <ClassCardComponent action_from="subject_teacher" data={item} key={index} />
            ))
          ) : isError ? (
            <p className="text-red-600">{extractErrorMessage(error)}</p>
          ) : (
            <p>Teacher has no class yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
