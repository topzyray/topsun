"use client";

import { useAuth } from "@/api/hooks/use-auth.hook";
import StudentCardComponent from "../../cards/student-card";
import { Parent, Student } from "../../../../types";
import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { ParentApiService } from "@/api/services/ParentApiService";
import { CircularLoader } from "../../loaders/page-level-loader";
import { extractErrorMessage } from "@/utils/extract-error-utils";
import BackButton from "@/components/buttons/BackButton";
import { Separator } from "@/components/ui/separator";

export default function MyChildren() {
  const { userDetails } = useAuth();
  const parent = userDetails as Parent;

  const { data, isLoading, isError, error } = useCustomQuery(["students", "studentById"], () =>
    ParentApiService.getAllLinkedStudentsInSchools(parent._id),
  );

  const children: Student[] = data?.students?.students !== undefined && data?.students?.students;

  return (
    <div>
      <div className="flex flex-col gap-4">
        <div>
          <BackButton />
        </div>

        <Separator />

        <div>
          <h1 className="text-xl uppercase">My Children Page</h1>
        </div>

        <Separator />

        <div className="">
          <div className="flex w-full flex-wrap justify-center gap-4">
            {isLoading ? (
              <CircularLoader text="Loading children data" />
            ) : children && children.length > 0 ? (
              children.map((child) => <StudentCardComponent data={child} key={child._id} />)
            ) : isError ? (
              <p className="text-red-600">{extractErrorMessage(error)}</p>
            ) : (
              <p>No child linked yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
