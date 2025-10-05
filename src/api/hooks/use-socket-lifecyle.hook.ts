"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SocketIOService } from "@/api/services/SocketIOService";

export function useSocketLifecycle() {
  const pathname = usePathname();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    function handleConnect() {
      setIsSocketConnected(true);
      console.log("🔗 Socket is connected");
    }

    function handleDisconnect() {
      setIsSocketConnected(false);
      console.log("🔌 Socket is disconnected");
    }

    if (pathname.startsWith("/dashboard/student/cbt/start")) {
      SocketIOService.offCustomEvents();
      SocketIOService.connect();
      SocketIOService.onConnect(handleConnect);
    } else {
      SocketIOService.offCustomEvents();
      SocketIOService.disconnect();
      SocketIOService.onDisconnect(handleDisconnect);
    }
  }, [pathname]);

  useEffect(() => {
    return () => {
      // Page or layout unload
      SocketIOService.offCustomEvents();
      SocketIOService.disconnect();
    };
  }, []);

  return { isSocketConnected };
}
