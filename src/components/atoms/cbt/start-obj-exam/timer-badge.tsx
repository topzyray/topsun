"use client";

import { cn } from "@/lib/utils";
import { TextHelper } from "@/helpers/TextHelper";
import { Clock } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

type TimerBadgeProps = {
  timeLeft: number; // in seconds
  totalTime?: number; // in seconds
  showIcon?: boolean;
  variant?: "compact" | "full";
};

export default function TimerBadge({
  timeLeft,
  totalTime = 1800, // default: 30 minutes
  showIcon = false,
  variant = "full",
}: TimerBadgeProps) {
  const percent = Math.max(0, Math.min((timeLeft / totalTime) * 100, 100));

  let color = "#16a34a";
  if (timeLeft <= 180)
    color = "#dc2626"; // red (3 mins)
  else if (timeLeft <= 300) color = "#ca8a04"; // yellow (5 mins)

  const timeFormatted = TextHelper.formatTimeInSeconds(timeLeft);

  const label = (
    <span
      className={cn(
        "font-bold",
        timeLeft <= 180
          ? "animate-pulse text-red-600"
          : timeLeft <= 300
            ? "text-yellow-600"
            : "text-primary",
      )}
    >
      {timeFormatted}
    </span>
  );

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1">
        {showIcon && <Clock className="text-muted-foreground h-4 w-4" />}
        {label}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 lg:h-16 lg:w-16">
        <CircularProgressbar
          value={percent}
          text={timeFormatted}
          strokeWidth={10}
          styles={buildStyles({
            textSize: "30px",
            textColor: color,
            pathColor: color,
            trailColor: "#e5e7eb",
          })}
        />
      </div>
      {showIcon && <Clock className="text-muted-foreground h-5 w-5" />}
    </div>
  );
}
