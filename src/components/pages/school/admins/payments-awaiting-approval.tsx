"use client";

import { Separator } from "@/components/ui/separator";
import React from "react";
import { PaymentsAwaitingApprovalTable } from "@/components/tables/school/admins/payments-awaiting-approval-table";
import BackButton from "@/components/buttons/BackButton";

export default function PaymentsAwaitingApprovalComponent() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <BackButton />
        <div>
          <Separator />

          <div className="py-4">
            <h2 className="text-lg uppercase">All payments awaiting approval</h2>
          </div>

          <Separator />
          <div>
            <PaymentsAwaitingApprovalTable />
          </div>
        </div>
      </div>
    </div>
  );
}
