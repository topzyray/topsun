"use client";

import BackButton from "@/components/buttons/BackButton";
import ObjQuestionsForm from "@/components/forms/cbt/obj-question-form";
import { Separator } from "@/components/ui/separator";

export default function SetOBJQuestions({ params }: { params: Record<string, any> }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg uppercase">Set Objective Questions Exams</h2>
      </div>
      <Separator />

      <div>
        <ObjQuestionsForm params={params} />
      </div>
    </div>
  );
}
