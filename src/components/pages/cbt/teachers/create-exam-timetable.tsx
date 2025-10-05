import BackButton from "@/components/buttons/BackButton";
import CreateExamTimetableForm from "@/components/forms/cbt/create-exam-timetable-form";
import { Separator } from "@/components/ui/separator";

export default function CreateExamTimetableComponent({ params }: { params: Record<string, any> }) {
  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>

      <Separator />
      <div className="py-4">
        <h2 className="text-lg uppercase">Create Timetable</h2>
      </div>
      <Separator />

      <div>
        <CreateExamTimetableForm params={params} />
      </div>
    </div>
  );
}
