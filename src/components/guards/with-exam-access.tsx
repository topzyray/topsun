"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/api/hooks/use-auth.hook";

interface WithExamAccessProps {
  subjectId: string;
  children: React.ReactNode;
}

export function WithExamAccess({ subjectId, children }: WithExamAccessProps) {
  const router = useRouter();
  const { userDetails } = useAuth();

  const student = userDetails as any; // Replace with correct Student type

  const canAccess =
    subjectId && student?.current_class?.class_id?._id && student?.role === "student"; // extend this logic as needed

  useEffect(() => {
    if (!canAccess) {
      router.push("/dashboard/student/cbt/subjects");
    }
  }, [canAccess, router]);

  if (!canAccess) {
    return null; // or a loader/spinner
  }

  return <>{children}</>;
}
