"use client";

import ScoreInputForm from "../../tables/school/score-recording";
import BackButton from "@/components/buttons/BackButton";
import { Separator } from "@/components/ui/separator";

export default function RecordScores({ params }: { params: Record<string, any> }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div>
        <h2 className="text-lg uppercase">Student Scores Recording Page</h2>
      </div>
      <Separator />

      <div>
        <ScoreInputForm params={params} />
      </div>
    </div>
  );
}
