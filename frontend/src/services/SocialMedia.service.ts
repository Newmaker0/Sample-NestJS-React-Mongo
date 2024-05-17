import io, { Socket } from "socket.io-client";

export interface VerificationResult {
  message: string;
}

export interface Platform {
  id: string;
  name: string;
  exampleIdentifier: string;
}
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SERVICE_URL_PATH = "/social-media";

export class SocialMediaService {
  static async verifyIdentifier(
    platform: string,
    identifier: string
  ): Promise<VerificationResult> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/verify`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ platform, identifier }),
    });
    if (!response.ok) {
      throw new Error("Invalid identifier");
    }
    return response.json();
  }

  static async fetchPlatforms(): Promise<Platform[]> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platform`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  static subscribeToPlatformUpdates(
    onUpdate: (platforms: Platform[]) => void
  ): Socket {
    const socket = io(`${API_BASE_URL}${SERVICE_URL_PATH}/updates`, {
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("WebSocket connection established");
    });

    socket.on("updates", (data: Platform[]) => {
      onUpdate(data);
    });

    socket.on("disconnect", () => {
      console.log("WebSocket connection closed");
    });

    socket.on("connect_error", (error: any) => {
      console.error("WebSocket connection error:", error);
    });

    return socket;
  }
}
