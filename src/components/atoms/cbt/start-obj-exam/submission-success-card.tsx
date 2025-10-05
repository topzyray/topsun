"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SubmissionSuccessCardProps {
  initialCountdown?: number;
  redirectPath?: string;
  title?: string;
  message?: string;
  buttonText?: string;
}

export default function SubmissionSuccessCard({
  initialCountdown = 5,
  redirectPath = "/dashboard/student/cbt/submitted",
  title = "✅ Submitted Successfully!",
  message = "Your responses have been saved.",
  buttonText = "Continue Now",
}: SubmissionSuccessCardProps) {
  const [countdown, setCountdown] = useState(initialCountdown);
  const router = useRouter();

  useEffect(() => {
    if (countdown === 0) {
      router.replace(redirectPath);
    }

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown, router, redirectPath]);

  return (
    <Card className="w-full p-6 text-center shadow-md">
      <CardContent className="space-y-4">
        <h2 className="text-2xl font-bold text-green-600">{title}</h2>
        <p className="text-muted-foreground text-lg">
          {message} You will be redirected in{" "}
          <strong>
            {countdown} second{countdown !== 1 ? "s" : ""}
          </strong>
          ...
        </p>
        <Button className="mt-4" onClick={() => router.replace(redirectPath)}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
}
