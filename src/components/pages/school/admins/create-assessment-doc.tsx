import BackButton from "@/components/buttons/BackButton";
import BulkCreateExamDocumentForm from "@/components/forms/cbt/create-assessment-document";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function CreateExamDocumentComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <div>
        <Separator />
        <div className="py-4">
          <h2 className="text-lg uppercase">Create Assessment Document</h2>
        </div>
        <Separator />
        <div>
          <BulkCreateExamDocumentForm />
        </div>
      </div>
    </div>
  );
}
