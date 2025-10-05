import BackButton from "@/components/buttons/BackButton";
import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";

interface RegistrationComponent {
  form: ReactNode;
}

export default function RegistrationComponent({ form }: RegistrationComponent) {
  return (
    <div>
      <div className="mb-4">
        <BackButton />
      </div>

      <Separator />

      <div>{form}</div>
    </div>
  );
}
