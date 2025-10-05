"use client";

import { Separator } from "@/components/ui/separator";
import { ParentTable } from "../../../tables/school/admins/parent-table";
import BackButton from "@/components/buttons/BackButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ParentManagementComponent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <Button onClick={() => router.push(`parents/parent_registration`)}>Create Parent</Button>
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All parents</h2>
        </div>
        <Separator />
        <div>
          <ParentTable />
        </div>
      </div>
    </div>
  );
}
