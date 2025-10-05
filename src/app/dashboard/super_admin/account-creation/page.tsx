import AccountCreationComponent from "@/components/forms/school/admins/account-creation";
import { userRegistrableDataSchoolOwner } from "@/constants";

export default function AccountCreationPage() {
  return <AccountCreationComponent userRegistrableData={userRegistrableDataSchoolOwner} />;
}
