import RegistrationComponent from "@/components/common/registration-component";
import AdminRegistrationForm from "@/components/forms/school/admins/registrations/admin";

export default function AdminRegistrationPage() {
  return <RegistrationComponent form={<AdminRegistrationForm />} />;
}
