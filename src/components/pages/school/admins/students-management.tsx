"use client";

import { Separator } from "@/components/ui/separator";
import { StudentTable } from "../../../tables/school/admins/student-table";
import BackButton from "@/components/buttons/BackButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StudentManagementComponent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <Button onClick={() => router.push(`students/student_registration`)}>Create Student</Button>
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All students</h2>
        </div>

        <Separator />
        <div>
          <StudentTable />
        </div>
      </div>
    </div>
  );
}
