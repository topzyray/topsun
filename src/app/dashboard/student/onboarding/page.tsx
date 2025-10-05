import BackButton from "@/components/buttons/BackButton";
import StudentProfileOnboardingForm from "@/components/pages/school/student-profile-update";
import { Separator } from "@/components/ui/separator";

export default function StudentProfileOnboarding() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <BackButton />
        <Separator />
        <h2 className="text-lg uppercase">Student profile onboarding</h2>
        <Separator />
        <div>
          <StudentProfileOnboardingForm />
        </div>
      </div>
    </div>
  );
}
