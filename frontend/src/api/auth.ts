const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const authApi = {
  register: async (username: string, email: string, password: string) => {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  getProfile: async (token: string) => {
    const res = await fetch(`${API_URL}/users/me`, {
      headers: { Authorization: token },
    });
    return res.json();
  },

  updateProfile: async (token: string, data: { username?: string; avatarUrl?: string }) => {
    const res = await fetch(`${API_URL}/users/me`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
