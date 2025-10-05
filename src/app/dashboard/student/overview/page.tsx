"use client";

import { useAuth } from "@/api/hooks/use-auth.hook";
import { useEffect, useMemo, useState } from "react";
import { Student } from "../../../../../types";
import NewSessionSubscription from "@/components/modals/new-session-subscription";
import OverviewComponent from "@/components/pages/school/overview-component";
export default function Overview() {
  const [showNewSubscription, setShowNewSessionSubscription] = useState(false);
  const { userDetails } = useAuth();
  const student = useMemo(() => {
    return (userDetails ?? {}) as Student;
  }, [userDetails]);

  useEffect(() => {
    if (
      student &&
      student.role === "student" &&
      student.new_session_subscription === null &&
      student.active_class_enrolment === false
    ) {
      setShowNewSessionSubscription(true);
    }
  }, [student]);

  return (
    <div>
      <OverviewComponent />
      <NewSessionSubscription
        open={showNewSubscription}
        student_id={student._id}
        closeOnSuccess={() => setShowNewSessionSubscription(false)}
        onClose={() => setShowNewSessionSubscription(false)}
      />
    </div>
  );
}
