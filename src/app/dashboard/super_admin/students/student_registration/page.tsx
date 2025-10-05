import RegistrationComponent from "@/components/common/registration-component";
import StudentRegistrationForm from "@/components/forms/school/admins/registrations/student";

export default function StudentRegistrationPage() {
  return <RegistrationComponent form={<StudentRegistrationForm />} />;
}
