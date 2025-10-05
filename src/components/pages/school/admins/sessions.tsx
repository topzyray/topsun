"use client";

import ComponentLevelLoader from "@/components/loaders/component-level-loader";
import { SessionTable } from "@/components/tables/school/admins/session-table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SessionApiService } from "@/api/services/SessionApiService";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import BackButton from "@/components/buttons/BackButton";

export default function SessionComponent() {
  const queryClient = useQueryClient();
  const router = useRouter();

  let { mutate: createSession, isPending: isCreatingSession } = useCustomMutation(
    SessionApiService.createSessionForSchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
      },
    },
  );

  const handleCreateSession = async () => {
    createSession({});
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <Button onClick={handleCreateSession} type="button" disabled={isCreatingSession}>
          {isCreatingSession ? (
            <ComponentLevelLoader loading={isCreatingSession} />
          ) : (
            "Create session"
          )}
        </Button>
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All session details</h2>
        </div>
        <Separator />
        <div>
          <SessionTable />
        </div>
      </div>
    </div>
  );
}
