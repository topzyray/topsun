import { envConfig } from "@/configs/env.config";
import { io } from "socket.io-client";

const socket = io(envConfig.NEXT_PUBLIC_API_BASE_URL, {
  transports: ["websocket"],
  autoConnect: false, // Important: Don't auto-connect on import
});

interface SocketResponse {
  status: boolean | string;
  message?: string;
  [key: string]: any;
}

export class SocketIOService {
  private static isConnected = false;

  static connect() {
    if (this.isConnected) {
      console.log("⚠️ Socket already connected.");
      return;
    }

    socket.connect(); // Explicitly connect

    socket.on("connect", () => {
      this.isConnected = true;
      console.log("✅ Socket connected: ", socket.id);
    });

    socket.on("disconnect", (reason) => {
      this.isConnected = false;
      console.warn("⚠️ Socket disconnected. Reason:", reason);
    });
  }

  static disconnect() {
    if (socket.connected) {
      console.log("🔌 Disconnecting socket:", socket.id);
      socket.removeAllListeners(); // Clean up everything
      socket.disconnect();
      this.isConnected = false;
      console.log("❌ Socket fully disconnected.");
    } else {
      console.log("⚠️ Socket already disconnected.");
    }
  }

  static isSocketConnected(): boolean {
    return socket.connected;
  }

  static offAll() {
    socket.removeAllListeners();
    this.isConnected = false;
  }

  static offCustomEvents() {
    socket.removeAllListeners("start-exam");
    socket.removeAllListeners("update-answer");
    socket.removeAllListeners("update-time");
    // Add more custom events as needed
  }

  static onConnect(callback: () => void) {
    socket.on("connect", callback);
  }

  static onDisconnect(callback: () => void) {
    socket.on("disconnect", callback);
  }

  static async startExam(payload: any): Promise<any> {
    return this.emitWithRetry("start-exam", payload);
  }

  static updateAnswer(answerPayload: any): Promise<any> {
    return this.emitWithRetry("update-answer", answerPayload);
  }

  static updateRemainingTime(timePayload: any): Promise<any> {
    return this.emitWithRetry("update-time", timePayload);
  }

  static submitExam(submitPayload: any): Promise<any> {
    return this.emitWithRetry("submit-exam", submitPayload); // FIXED
  }

  private static async emitWithRetry<T extends SocketResponse>(
    event: string,
    payload: any,
    {
      retries = 3,
      delay = 1000,
      timeout = 5000,
    }: { retries?: number; delay?: number; timeout?: number } = {},
  ): Promise<T> {
    let lastErrorResponse: any = null;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await new Promise<T>((resolve, reject) => {
          const timer = setTimeout(() => reject(new Error("Ack timeout")), timeout);

          socket.emit(event, payload, (res: any) => {
            clearTimeout(timer);
            resolve(res);
          });
        });

        if (response?.status) return response;

        lastErrorResponse = response;
        console.warn(`Emit attempt ${attempt} failed:`, response.message);
      } catch (err: any) {
        lastErrorResponse = { status: "error", message: err.message };
        console.warn(`Emit attempt ${attempt} threw error:`, err.message);
      }

      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    return lastErrorResponse || { status: "error", message: "Unknown failure" };
  }
}
