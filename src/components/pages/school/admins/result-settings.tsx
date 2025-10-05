"use client";

import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/buttons/BackButton";
import CreateResultSettingsForm from "@/components/forms/school/admins/create-result-settings-form";

export default function ResultSettingsComponent() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>
      <div>
        <Separator />
        <div className="py-4">
          <h2 className="text-lg uppercase">Result settings creation</h2>
        </div>
        <Separator />
        <div>
          <CreateResultSettingsForm />
        </div>
      </div>
    </div>
  );
}
