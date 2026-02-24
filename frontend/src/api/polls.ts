const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.accessToken || "";
};

export const pollApi = {
  getAll: async (page = 1) => {
    const res = await fetch(`${API_URL}/polls?page=${page}`, {
      headers: { Authorization: getToken() },
    });
    return res.json();
  },

  getByShareId: async (shareId: string) => {
    const res = await fetch(`${API_URL}/polls/${shareId}`);
    return res.json();
  },

  create: async (pollData: {
    title: string;
    description: string;
    options: { label: string; imageUrl: string; externalUrl: string }[];
    status: string;
  }) => {
    const res = await fetch(`${API_URL}/polls`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(pollData),
    });
    return res.json();
  },

  vote: async (pollId: string, optionIndex: number) => {
    const res = await fetch(`${API_URL}/polls/${pollId}/vote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify({ optionIndex }),
    });
    return res.json();
  },

  delete: async (pollId: string) => {
    const res = await fetch(`${API_URL}/polls/${pollId}`, {
      method: "DELETE",
      headers: { Authorization: getToken() },
    });
    return res.json();
  },
};
