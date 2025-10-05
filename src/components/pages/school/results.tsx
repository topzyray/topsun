"use client";

import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/buttons/BackButton";
import { ResultsTable } from "@/components/tables/school/admins/results-table";
import { useAuth } from "@/api/hooks/use-auth.hook";

export default function ResultsComponent({ params }: { params: Record<string, any> }) {
  const { userDetails } = useAuth();
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <div>
        <Separator />
        <div className="py-4">
          <h2 className="text-lg uppercase">
            {userDetails?.role === "student" && "All My Results"}
            {userDetails?.role === "parent" && "My Child Results"}
            {userDetails?.role === "teacher" && "My Student Results"}
            {userDetails?.role === "admin" && "Student Results"}
            {userDetails?.role === "super_admin" && "Student Results"}
          </h2>
        </div>
        <Separator />
        <div>
          <ResultsTable student_id={params.student_id} />
        </div>
      </div>
    </div>
  );
}
