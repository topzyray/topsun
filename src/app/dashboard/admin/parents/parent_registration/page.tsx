import RegistrationComponent from "@/components/common/registration-component";
import ParentRegistrationForm from "@/components/forms/school/admins/registrations/parent";

export default function ParentRegistrationPage() {
  return <RegistrationComponent form={<ParentRegistrationForm />} />;
}
