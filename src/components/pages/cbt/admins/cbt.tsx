"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/buttons/BackButton";
import { AssessmentsDocumentTable } from "@/components/tables/school/admins/assessment-document-table";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { RoleTypeEnum } from "@/api/enums/RoleTypeEnum";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { InfoIcon } from "lucide-react";

export default function CbtComponent() {
  // const [openCreateCutOffMinutesForm, setOpenCreateCutOffMinutesForm] = useState(false);
  const { userDetails } = useAuth();

  const router = useRouter();

  const handleEndAllAssessments = () => {
    // TODO
    // Add all the logic to end all assessments
    toast("This feature is pending!", {
      style: {
        backgroundColor: "lightgreen",
      },
      icon: <InfoIcon size={15} />,
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      {userDetails && userDetails?.role === RoleTypeEnum.SUPER_ADMIN && (
        <>
          <Separator />
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => router.push("cbt/create_assessment_document")} type="button">
              Create Assessment Document
            </Button>
            <Button onClick={handleEndAllAssessments} type="button">
              End All Assessments
            </Button>
          </div>
        </>
      )}
      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All assessment documents details</h2>
        </div>

        <Separator />
        <div>
          <AssessmentsDocumentTable />
        </div>
      </div>

      {/* <CreateCutOffMinutesForSchoolForm
        open={openCreateCutOffMinutesForm}
        onClose={() => {
          setOpenCreateCutOffMinutesForm(false);
        }}
        closeOnSuccess={() => {
          setOpenCreateCutOffMinutesForm(false);
        }}
      /> */}
    </div>
  );
}
