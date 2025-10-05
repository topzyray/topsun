"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React from "react";
import BackButton from "@/components/buttons/BackButton";
import TooltipComponent from "@/components/info/tool-tip";
import { SchoolAccountsTable } from "@/components/tables/school/admins/school-accounts-table";
import AddSchoolAccountForm from "@/components/forms/school/admins/add-school-account";

export default function SchoolAccountsComponent() {
  const [openActionForm, setOpenActionForm] = React.useState({
    addSchoolAccount: false,
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-2">
        <TooltipComponent
          trigger={
            <Button
              onClick={() =>
                setOpenActionForm((prev) => ({
                  ...prev,
                  addSchoolAccount: true,
                }))
              }
              type="button"
            >
              Add School Account
            </Button>
          }
          message={"Add school account details"}
        />
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All school accounts</h2>
        </div>

        <Separator />
        <div>
          <SchoolAccountsTable />
        </div>
      </div>

      <AddSchoolAccountForm
        open={openActionForm.addSchoolAccount}
        onClose={() =>
          setOpenActionForm((prev) => ({
            ...prev,
            addSchoolAccount: false,
          }))
        }
        closeOnSuccess={() => {
          setOpenActionForm((prev) => ({
            ...prev,
            addSchoolAccount: false,
          }));
        }}
      />
    </div>
  );
}
