"use client";

import BackButton from "@/components/buttons/BackButton";
import { StudentsTeacherManagesTable } from "@/components/tables/school/student-teacher-manages-table";
import { Separator } from "@/components/ui/separator";

export default function StudentTeacherManages({ params }: { params: Record<string, any> }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg uppercase">Students I am Managing</h2>
      </div>
      <Separator />

      <div>
        <StudentsTeacherManagesTable params={params} />
      </div>
    </div>
  );
}
