import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { X } from "lucide-react";
import CancelButton from "../buttons/CancelButton";
import SubmitButton from "../buttons/SubmitButton";
import { Session } from "../../../types";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { SessionApiService } from "@/api/services/SessionApiService";
import { useQueryClient } from "@tanstack/react-query";

interface EndSessionAlert {
  session: Session;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EndSessionAlert({ session, onClose, onSuccess }: EndSessionAlert) {
  const queryClient = useQueryClient();

  const { mutate: endSession, isPending: isEndingSession } = useCustomMutation(
    (session_id: string) => SessionApiService.endSessionByIdForASchool(session_id),
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        queryClient.invalidateQueries({ queryKey: ["sessionById"] });
        onSuccess();
      },
    },
  );
  return (
    <Card>
      <CardHeader className="text-center text-lg uppercase">
        <div className="flex flex-col items-center">
          <X size={35} className="text-red-600" />
          <h2>Confirmation</h2>
        </div>
      </CardHeader>
      <CardContent>
        <div className="max-w-sm space-y-3 text-center">
          <div className="space-y-2">
            <p className="text-lg">
              You are about to end &quot;{session?.academic_session}&quot; session
            </p>
            <p className="text-red-500">Note: This action cannot be undone once submitted.</p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CancelButton onClose={onClose} />
            <SubmitButton
              loading={isEndingSession}
              text="End"
              disabled={isEndingSession}
              onSubmit={() => endSession(session?._id)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
