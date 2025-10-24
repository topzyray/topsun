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
import { useContext } from "react";
import { GlobalContext } from "@/providers/global-state-provider";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { CbtApiService } from "@/api/services/CbtApiService";
import { useQueryClient } from "@tanstack/react-query";
import ComponentLevelLoader from "@/components/loaders/component-level-loader";
import SubmitButton from "@/components/buttons/SubmitButton";

export default function CbtComponent() {
  const { userDetails } = useAuth();
  const queryClient = useQueryClient();
  const { activeSessionData } = useContext(GlobalContext);

  const router = useRouter();

  const endAllActiveAssessmentDocMutation = useCustomMutation(
    CbtApiService.endAllActiveTermCbtAssessmentDocumentsInATerm,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["assessments"] });
      },
    },
  );

  const handleEndAllAssessments = () => {
    endAllActiveAssessmentDocMutation.mutate({
      requestBody: {
        academic_session_id: activeSessionData?.activeSession?._id as string,
        term: activeSessionData?.activeTerm?.name as string,
      },
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

            <SubmitButton
              type="button"
              loading={endAllActiveAssessmentDocMutation.isPending}
              disabled={endAllActiveAssessmentDocMutation.isPending}
              onSubmit={handleEndAllAssessments}
              text="End All Assessments"
            />
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
