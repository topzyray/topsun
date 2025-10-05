import { useEffect, useRef } from "react";
import toast from "react-hot-toast";

type UseExamTimerProps = {
  initialTime: number;
  onTimeExpire: () => void;
  onTick?: (timeLeft: number) => void;
};

export function useExamTimer({ initialTime, onTimeExpire, onTick }: UseExamTimerProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const timeLeftRef = useRef(initialTime);
  const timeAlertShownRef = useRef<{ [key: number]: boolean }>({});

  useEffect(() => {
    timeLeftRef.current = initialTime;

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      timeLeftRef.current -= 1;
      const current = timeLeftRef.current;

      onTick?.(current);

      if (current <= 300 && !timeAlertShownRef.current[300]) {
        toast.error("⚠️ You have 5 minutes left!", { id: "five-mins-warning" });
        timeAlertShownRef.current[300] = true;
      }

      if (current <= 180 && !timeAlertShownRef.current[180]) {
        toast.error("⏰ Only 3 minutes left. Wrap up your answers!", {
          id: "three-mins-warning",
        });
        timeAlertShownRef.current[180] = true;
      }

      if (current <= 0) {
        clearInterval(timerRef.current!);
        onTimeExpire();
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [initialTime, onTimeExpire, onTick]);

  return { timeLeftRef };
}
