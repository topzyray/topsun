"use client";

import React from "react";
import BackButton from "@/components/buttons/BackButton";
import AddNewClass from "@/components/forms/school/admins/add-class";
import { ClassTable } from "@/components/tables/school/admins/class-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddClassLevelForSchoolForm from "@/components/forms/school/admins/add-class-level-form";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { RoleTypeEnum } from "@/api/enums/RoleTypeEnum";

export default function ClassComponent() {
  const [openAddClassLevelForm, setOpenAddClassLevelForm] = React.useState(false);
  const [openNewClassForm, setOpenNewClassForm] = React.useState(false);

  const { userDetails } = useAuth();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div className="space-x-3">
        {userDetails?.role === RoleTypeEnum.SUPER_ADMIN && (
          <Button onClick={() => setOpenAddClassLevelForm(true)} type="button">
            Create Class Levels
          </Button>
        )}
        <Button onClick={() => setOpenNewClassForm(true)} type="button">
          Create Class
        </Button>
      </div>
      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All classes details</h2>
        </div>

        <Separator />
        <div>
          <ClassTable />
        </div>
      </div>

      {/* Add class level form */}
      <AddClassLevelForSchoolForm
        open={openAddClassLevelForm}
        onClose={() => {
          setOpenAddClassLevelForm(false);
        }}
        closeOnSuccess={() => {
          setOpenAddClassLevelForm(false);
        }}
      />

      {/* Add new class */}
      <AddNewClass
        open={openNewClassForm}
        onClose={() => setOpenNewClassForm(false)}
        closeOnSuccess={() => {
          setOpenNewClassForm(false);
        }}
      />
    </div>
  );
}
