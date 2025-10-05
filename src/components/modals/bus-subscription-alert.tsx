"use client";

import { GlobalContext } from "@/providers/global-state-provider";
import { Bus } from "lucide-react";
import { useContext } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function BusSubscriptionAlert({
  message,
  onClose,
  closeOnSuccess,
}: {
  message: string;
  onClose: () => void;
  closeOnSuccess: () => void;
}) {
  const { activeSessionData } = useContext(GlobalContext);

  return (
    <Card className="bg-sidebar">
      <CardHeader className="animate-pulse text-center">
        SCHOOL BUS SUBSCRIPTION ALERT! ⚠️
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4">
            <p className="flex items-center justify-center text-center">
              <Bus size={50} />
            </p>
            <h3 className="mt-2 text-3xl font-bold">
              {message} to subscribe to school bus for{" "}
              <span className="capitalize">
                {activeSessionData.activeTerm?.name.replace(/_/g, " ")}{" "}
              </span>
              in order to make payments.
            </h3>
          </div>
          <div className="flex gap-2">
            <Button onClick={onClose} variant="ghost">
              Remind Me Later
            </Button>
            <Button onClick={closeOnSuccess}>Subscribe Now</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
