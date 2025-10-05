import RegistrationComponent from "@/components/common/registration-component";
import TeacherRegistrationForm from "@/components/forms/school/admins/registrations/teacher";

export default function TeacherRegistrationPage() {
  return <RegistrationComponent form={<TeacherRegistrationForm />} />;
}
