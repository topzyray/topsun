"use client";

import Image from "next/image";
import ErrorBox from "@/components/atoms/error-box";
import { CircularLoader } from "@/components/loaders/page-level-loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GlobalContext } from "@/providers/global-state-provider";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { envConfig } from "@/configs/env.config";
import { useAuth } from "@/api/hooks/use-auth.hook";
import { Student } from "../../../../../types";
import TooltipComponent from "@/components/info/tool-tip";

export default function CBTLanding() {
  const schoolNameFull: string = envConfig.NEXT_PUBLIC_SCHOOL_NAME_FULL;
  const { activeSessionData } = useContext(GlobalContext);

  const { userDetails } = useAuth();
  const student = (userDetails as Student) ?? {};

  const router = useRouter();

  const renderErrorButton = () => {
    if (!student?.current_class?.class_id?._id) {
      if (!student?.active_class_enrolment) {
        return (
          <TooltipComponent
            trigger={<Button variant="destructive">Not Enrolled Yet</Button>}
            message={<p>You are not enrolled to class yet.</p>}
          />
        );
      } else {
        return (
          <TooltipComponent
            trigger={
              <Button
                variant="destructive"
                onClick={() => router.push("/dashboard/student/onboarding")}
              >
                Update Profile First
              </Button>
            }
            message={<p>You need to update your profile to proceed</p>}
          />
        );
      }
    } else {
      return <Button onClick={() => router.push("cbt/guide")}>Proceed to Assessment</Button>;
    }
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="mt-5 w-full max-w-4xl py-12 shadow-md lg:mt-10 lg:py-18">
        <CardContent className="p-4">
          <div className="space-y-6 text-center lg:px-10">
            <h1 className="text-2xl font-bold uppercase lg:text-4xl">
              🎓 Welcome to {schoolNameFull} CBT Portal
            </h1>

            <p className="text-muted-foreground text-lg lg:text-xl">
              Access all your assessments and get ready to take your tests!
            </p>

            <div className="h-64 w-full">
              <Image
                width={350}
                height={195}
                src="/images/assessment.png"
                alt="Exam Illustration"
                className="mx-auto h-full rounded-lg"
              />
            </div>

            {activeSessionData?.loading ? (
              <CircularLoader text="Loading session data" />
            ) : activeSessionData?.activeSession ? (
              <p className="text-muted-foreground text-sm lg:text-base">
                Session: <strong>{activeSessionData?.activeSession?.academic_session}</strong> |
                Term:{" "}
                <strong className="capitalize">
                  {(activeSessionData?.activeTerm?.name &&
                    activeSessionData?.activeTerm?.name.replace(/_/g, " ")) ||
                    "No active term"}
                </strong>
              </p>
            ) : activeSessionData?.error ? (
              <ErrorBox error={activeSessionData?.error} />
            ) : (
              <p>No Data Found</p>
            )}

            <Separator />

            <div className="flex items-center justify-between">
              <Button onClick={() => router.back()}>Back</Button>

              {renderErrorButton()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
