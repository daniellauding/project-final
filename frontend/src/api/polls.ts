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
    const res = await fetch(`${API_URL}/polls/${shareId}`, {
      headers: { Authorization: getToken() },
    });
    return res.json();
  },

  create: async (pollData: {
    title: string;
    description: string;
    options: { label: string; imageUrl?: string; videoUrl?: string; audioUrl?: string; externalUrl?: string; embedUrl?: string; fileUrl?: string; fileName?: string }[];
    status: string;
    visibility?: string;
    allowAnonymousVotes?: boolean;
    allowRemix?: boolean;
    showWinner?: boolean;
    deadline?: string;
    password?: string;
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

  voteAnonymous: async (pollId: string, optionIndex: number) => {
    const fingerprint = localStorage.getItem("anon_fp") || (() => {
      const fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem("anon_fp", fp);
      return fp;
    })();
    const res = await fetch(`${API_URL}/polls/${pollId}/vote-anonymous`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionIndex, fingerprint }),
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
    formData.append("file", file);
    const res = await fetch(`${API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: getToken() },
      body: formData,
    });
    return res.json();
  },

  uploadWithProgress: (
    file: File,
    onProgress: (info: { loaded: number; total: number; percent: number }) => void,
  ): { promise: Promise<any>; abort: () => void } => {
    const xhr = new XMLHttpRequest();
    const promise = new Promise<any>((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          onProgress({ loaded: e.loaded, total: e.total, percent: Math.round((e.loaded / e.total) * 100) });
        }
      });
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      });
      xhr.addEventListener("error", () => reject(new Error("Upload failed")));
      xhr.addEventListener("abort", () => reject(new Error("Upload cancelled")));

      xhr.open("POST", `${API_URL}/upload`);
      xhr.setRequestHeader("Authorization", getToken());
      xhr.send(formData);
    });
    return { promise, abort: () => xhr.abort() };
  },

update: async (pollId: string, data: { title?: string; description?: string; status?: string; visibility?: string; options?: any[]; allowRemix?: boolean; allowAnonymousVotes?: boolean; showWinner?: boolean; deadline?: string; password?: string }) => {
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

  remix: async (pollId: string, data: { title?: string; description?: string; options?: Record<string, any>[] }) => {
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

  editComment: async (commentId: string, data: { text?: string; imageUrl?: string }) => {
    const res = await fetch(`${API_URL}/comments/${commentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: getToken() },
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
