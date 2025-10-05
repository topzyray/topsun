"use client";

import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/buttons/BackButton";
import { StudentsWithoutSessionSubscriptionTable } from "@/components/tables/school/admins/student-without-session-subscription-table";

export default function StudentWithoutSessionSubscriptionComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">Students not subscribed to new session</h2>
        </div>

        <Separator />
        <div>
          <StudentsWithoutSessionSubscriptionTable />
        </div>
      </div>
    </div>
  );
}
