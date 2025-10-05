"use client";

import { useCustomQuery } from "@/api/hooks/queries/use-query.hook";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { ParentApiService } from "@/api/services/ParentApiService";
import ResultsComponent from "@/components/pages/school/results";
import { Parent, Student } from "../../../../../../../types";
import { usePathname } from "next/navigation";

export default function ResultsPage() {
  const pathname = usePathname();
  const child_id = pathname.split("/")[4];

  const { userDetails } = useAuth();
  const parent = userDetails as Parent;

  let { data } = useCustomQuery(["students", "studentById"], () =>
    ParentApiService.getAllLinkedStudentsInSchools(parent._id),
  );

  let children: Student[] = data?.students?.students !== undefined && data?.students?.students;

  let child_data = children.length > 0 && children.filter((child) => child._id === child_id)[0];
  const params = {
    student_id: child_data ? (child_data?._id as string) : "",
  };
  return <ResultsComponent params={params} />;
}
