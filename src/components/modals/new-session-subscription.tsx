"use client";

import { GlobalContext } from "@/providers/global-state-provider";
import { School } from "lucide-react";
import { useContext } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { useQueryClient } from "@tanstack/react-query";
import { StudentApiService } from "@/api/services/StudentApiService";
import { StorageUtilsHelper } from "@/utils/storage-utils";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { Student } from "../../../types";
import { STORE_KEYS } from "@/configs/store.config";
import SubmitButton from "../buttons/SubmitButton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Separator } from "../ui/separator";

export default function NewSessionSubscription({
  student_id,
  open,
  onClose,
  closeOnSuccess,
}: {
  student_id: string;
  open: boolean;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const { activeSessionData } = useContext(GlobalContext);
  const queryClient = useQueryClient();
  const { userDetails, setUserDetails } = useAuth();

  const { mutate: subscribeStudentToSession, isPending: isSubscribingStudentToSession } =
    useCustomMutation(StudentApiService.updateStudentSessionSubscriptionInASchool, {
      onSuccessCallback: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["students", "studentById", student_id],
        });
        if (userDetails?.role === "student") {
          StorageUtilsHelper.saveToLocalStorage([
            STORE_KEYS.USER_DETAILS,
            {
              ...userDetails,
              new_session_subscription: data?.student?.new_session_subscription,
              admission_session: data?.student?.admission_session,
            },
          ]);

          setUserDetails({
            ...userDetails,
            new_session_subscription: data?.student?.new_session_subscription,
            admission_session: data?.student?.admission_session,
          } as Student);
        }

        closeOnSuccess();
      },
    });

  const handleNewSessionSubscription = async () => {
    subscribeStudentToSession({
      academic_session_id: activeSessionData.activeSession?._id as string,
      student_id: student_id,
      new_session_subscription_status: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="uppercase">New Session Enrollment Alert! ⚠️</DialogTitle>
        </DialogHeader>
        <DialogDescription></DialogDescription>

        <Separator />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <p className="flex items-center justify-center text-center">
              <School size={50} />
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              Welcome to <span>{activeSessionData.activeSession?.academic_session} </span>
              <span className="capitalize">academic session</span>
            </h3>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onClose} variant="ghost">
              Remind Me Later
            </Button>
          </DialogClose>

          <SubmitButton
            loading={isSubscribingStudentToSession}
            onSubmit={handleNewSessionSubscription}
            disabled={isSubscribingStudentToSession}
            text="Subscribe to Session"
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
