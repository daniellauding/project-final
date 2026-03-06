import { create } from "zustand";
import { pollApi } from "../api/polls";

interface PollOption {
  label: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  embedUrl?: string;
  fileUrl?: string;
  fileName?: string;
  textContent?: string;
  coverUrl?: string;
  voteCount: number;
  percentage: number;
  votes: string[];
}

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: PollOption[];
  shareId: string;
  creator: string;
  creatorName: string;
  totalVotes?: number;
  results?: PollOption[];
  status: string;
  visibility?: string;
  password?: string;
  createdAt: string;
}

interface PollStore {
  polls: Poll[];
  loading: boolean;
  error: string | null;
  fetchPolls: (page?: number, includeRemixes?: boolean) => Promise<void>;
  deletePoll: (id: string) => Promise<void>;
  reset: () => void;
}

export const usePollStore = create<PollStore>((set, get) => ({
  polls: [],
  loading: false,
  error: null,

  fetchPolls: async (page = 1, includeRemixes = false) => {
    set({ loading: true, error: null });
    try {
      const data = await pollApi.getAll(page, includeRemixes);
      set({ polls: data.results || [], loading: false });
    } catch (err) {
      set({ error: "Could not fetch polls", loading: false });
    }
  },

  deletePoll: async (id: string) => {
    await pollApi.delete(id);
    set({ polls: get().polls.filter((p) => p._id !== id) });
  },

  reset: () => set({ polls: [], loading: false, error: null }),
}));
