"use client";

import { useAuth } from "@/api/hooks/use-auth.hook";
import ResultsComponent from "@/components/pages/school/results";
import { Student } from "../../../../../types";

export default function MyResultsPage() {
  const { userDetails } = useAuth();
  const student = (userDetails as Student) ?? {};
  const params = {
    student_id: student?._id,
  };
  return <ResultsComponent params={params} />;
}
