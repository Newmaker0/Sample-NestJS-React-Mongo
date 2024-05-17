import { Identifier, Platform, PlatformWithIdentifiers } from "./models";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SERVICE_URL_PATH = "/social-media";

export class SocialMediaService {
  static async fetchPlatforms(): Promise<Platform[]> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platform`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }

  static async addPlatform(
    name: string,
    exampleIdentifier: string
  ): Promise<PlatformWithIdentifiers> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platform`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ name, exampleIdentifier }),
    });

    if (!response.ok) {
      throw new Error("Failed to add platform");
    }

    return response.json();
  }

  static async deletePlatform(id: string): Promise<void> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platform/${id}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete platform");
    }
  }

  static async updatePlatformExample(
    id: string,
    newExample: string
  ): Promise<void> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platform/${id}/example`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ newExample }),
    });
    if (!response.ok) {
      throw new Error("Failed to update platform example");
    }
  }

  static async updatePlatformName(id: string, newName: string): Promise<void> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platform/${id}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ newName }),
    });
    if (!response.ok) {
      throw new Error("Failed to update platform name");
    }
  }

  static async deletePlatformIdentifier(identifierId: string): Promise<void> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/identifier/${identifierId}`;
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete identifier");
    }
  }

  static async updatePlatformIdentifier(
    identifierId: string,
    newValue: string
  ): Promise<void> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/identifier/${identifierId}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ newValue }),
    });
    if (!response.ok) {
      throw new Error("Failed to update platform identifier");
    }
  }

  static async addIdentifier(
    platformId: string,
    identifier: string
  ): Promise<Identifier> {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platform/${platformId}/identifier`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({ identifier }),
    });

    if (!response.ok) {
      throw new Error("Failed to add identifier");
    }

    return response.json();
  }

  static async fetchPlatformsAndIdentifiers(): Promise<
    PlatformWithIdentifiers[]
  > {
    const url = `${API_BASE_URL}${SERVICE_URL_PATH}/platforms-with-identifiers`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  }
}
