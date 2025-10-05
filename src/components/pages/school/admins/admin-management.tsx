"use client";

import BackButton from "@/components/buttons/BackButton";
import { AdminTable } from "@/components/tables/school/admins/admin-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";

export default function SchoolAdminManagementComponent() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <Button onClick={() => router.push(`school_admins/admin_registration`)}>
          Create Admin
        </Button>
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All school admins</h2>
        </div>

        <Separator />
        <div>
          <AdminTable />
        </div>
      </div>
    </div>
  );
}
