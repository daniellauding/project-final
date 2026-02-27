const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const getToken = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.accessToken || "";
};

export const pollApi = {
  getAll: async (page = 1, includeRemixes = false) => {
    const params = `page=${page}${includeRemixes ? "&includeRemixes=true" : ""}`;
    const res = await fetch(`${API_URL}/polls?${params}`, {
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
    options: { label: string; imageUrl?: string; externalUrl?: string; embedUrl?: string }[];
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

  unvote: async (pollId: string) => {
    const res = await fetch(`${API_URL}/polls/${pollId}/unvote`, {
      method: "POST",
      headers: { Authorization: getToken() },
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

  upload: async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: getToken() },
      body: formData,
    });
    return res.json();
  },

update: async (pollId: string, data: { title?: string; description?: string; status?: string; visibility?: string; options?: any[]; allowRemix?: boolean; password?: string }) => {
    const res = await fetch(`${API_URL}/polls/${pollId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  remix: async (pollId: string, data: { title?: string; options?: { label: string }[] }) => {
    const res = await fetch(`${API_URL}/polls/${pollId}/remix`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  getComments: async (pollId: string) => {
    const res = await fetch(`${API_URL}/polls/${pollId}/comments`);
    return res.json();
  },

  addComment: async (pollId: string, data: { text: string; optionIndex?: number; imageUrl?: string }) => {
    const res = await fetch(`${API_URL}/polls/${pollId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getToken(),
      },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  deleteComment: async (commentId: string) => {
    const res = await fetch(`${API_URL}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: getToken() },
    });
    return res.json();
  },
};
