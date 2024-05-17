export interface AuthResponse {
  access_token: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class AuthService {
  static async login(
    username: string,
    password: string
  ): Promise<AuthResponse> {
    const url = `${API_BASE_URL}/auth/login`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    return response.json();
  }

  static async verifyToken(token: string): Promise<any> {
    const url = `${API_BASE_URL}/auth/verify`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Token verification failed");
    }
    return response.json();
  }
}
