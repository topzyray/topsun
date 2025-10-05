import AccountCreationComponent from "@/components/forms/school/admins/account-creation";
import { userRegistrableDataSchoolAmin } from "@/constants";

export default function AccountCreationPage() {
  return <AccountCreationComponent userRegistrableData={userRegistrableDataSchoolAmin} />;
}
