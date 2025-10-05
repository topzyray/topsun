"use client";

import React from "react";
import { SubjectTable } from "@/components/tables/school/admins/subject-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/buttons/BackButton";
import CreateNewSubject from "@/components/forms/school/admins/create-subject";

export default function SubjectComponent() {
  const [openNewSubjectForm, setOpenNewSubjectForm] = React.useState(false);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <Button onClick={() => setOpenNewSubjectForm(true)} type="button">
          Create Subject
        </Button>
      </div>
      <div>
        <Separator />
        <div className="py-4">
          <h2 className="text-lg uppercase">All subject details</h2>
        </div>
        <Separator />
        <div>
          <SubjectTable />
        </div>
      </div>

      <CreateNewSubject
        open={openNewSubjectForm}
        onClose={() => setOpenNewSubjectForm(false)}
        closeOnSuccess={() => {
          setOpenNewSubjectForm(false);
        }}
      />
    </div>
  );
}
