"use client";

import BackButton from "@/components/buttons/BackButton";
import { TeachersTable } from "@/components/tables/school/admins/teacher-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function TeacherManagementComponent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <Button onClick={() => router.push(`teachers/teacher_registration`)}>Create Teacher</Button>
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All teachers</h2>
        </div>

        <Separator />
        <div>
          <TeachersTable />
        </div>
      </div>
    </div>
  );
}
