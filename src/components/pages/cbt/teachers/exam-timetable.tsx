"use client";

import { RoleTypeEnum } from "@/api/enums/RoleTypeEnum";
import { useAuth } from "@/api/hooks/use-auth.hook";
import BackButton from "@/components/buttons/BackButton";
import { ExamTimetableTable } from "@/components/tables/cbt/exam-timetable-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function ExamTimetableComponent({ params }: { params: Record<string, any> }) {
  const { userDetails } = useAuth();
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      {(userDetails?.role === RoleTypeEnum.SUPER_ADMIN ||
        userDetails?.role === RoleTypeEnum.ADMIN) && (
        <div className="space-y-4">
          <Button onClick={() => router.push(`${params.class_level}/create`)} type="button">
            Create Assessment Timetable
          </Button>
          <Separator />
        </div>
      )}
      <div>
        <div className="pb-4">
          <h2 className="text-lg uppercase">
            All assessment timetable for {decodeURIComponent(params.class_level)}
          </h2>
        </div>

        <Separator />
        <div>
          <ExamTimetableTable params={params} />
        </div>
      </div>
    </div>
  );
}
