"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AddNewEnrollment from "../../../forms/school/admins/add-enrollment";
import { EnrollmentTable } from "../../../tables/school/admins/enrollment-table";
import { useRouter } from "next/navigation";
import { useCustomMutation } from "@/api/hooks/queries/use-mutation.hook";
import { StudentApiService } from "@/api/services/StudentApiService";
import { useQueryClient } from "@tanstack/react-query";
import AddReturningStudents from "@/components/forms/school/admins/add-returning-student";
import BackButton from "@/components/buttons/BackButton";
import SubmitButton from "@/components/buttons/SubmitButton";
import TooltipComponent from "@/components/info/tool-tip";

export default function EnrollmentsComponent() {
  const [openEnrollmentForm, setOpenEnrollmentForm] = React.useState({
    newStudent: false,
    returningStudent: false,
  });
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: sendNotification, isPending: isSendingNotification } = useCustomMutation(
    StudentApiService.studentsSubscribeToNewSessionInASchool,
    {
      onSuccessCallback: () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
      },
    },
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <BackButton />
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-2">
        <TooltipComponent
          trigger={
            <Button
              onClick={() =>
                setOpenEnrollmentForm((prev) => ({
                  ...prev,
                  newStudent: true,
                }))
              }
              type="button"
            >
              New Student
            </Button>
          }
          message={"New students enrollment"}
        />

        <TooltipComponent
          trigger={
            <div>
              <SubmitButton
                onSubmit={() => router.push("enrollments/students_session_subscription")}
                loading={isSendingNotification}
                text="Session Subscription"
                type="button"
              />
            </div>
          }
          message={"View students that has not subscribed to new session"}
        />

        {/* <TooltipComponent
          trigger={
            <div>
              <SubmitButton
                disabled={
                  (isSendingNotification as boolean) ||
                  (activeSessionData?.activeSession?.is_active as boolean)
                }
                onSubmit={() => sendNotification({})}
                loading={isSendingNotification}
                text="Send Notification"
                type="button"
              />
            </div>
          }
          message={"Send email for session subscription"}
        /> */}

        <TooltipComponent
          trigger={
            <Button
              onClick={() =>
                setOpenEnrollmentForm((prev) => ({
                  ...prev,
                  returningStudent: true,
                }))
              }
              type="button"
            >
              Returning Student
            </Button>
          }
          message={"Returning students enrollment"}
        />
      </div>

      <div>
        <Separator />

        <div className="py-4">
          <h2 className="text-lg uppercase">All enrollments details</h2>
        </div>

        <Separator />
        <div>
          <EnrollmentTable />
        </div>
      </div>

      {/* For new students */}
      <AddNewEnrollment
        open={openEnrollmentForm.newStudent}
        onClose={() =>
          setOpenEnrollmentForm((prev) => ({
            ...prev,
            newStudent: false,
          }))
        }
        closeOnSuccess={() => {
          setOpenEnrollmentForm((prev) => ({
            ...prev,
            newStudent: false,
          }));
        }}
      />

      {/* For returning students */}
      <AddReturningStudents
        open={openEnrollmentForm.returningStudent}
        onClose={() =>
          setOpenEnrollmentForm((prev) => ({
            ...prev,
            returningStudent: false,
          }))
        }
        closeOnSuccess={() => {
          setOpenEnrollmentForm((prev) => ({
            ...prev,
            returningStudent: false,
          }));
        }}
      />
    </div>
  );
}
