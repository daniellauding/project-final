import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePollStore } from "./pollStore";

// Mock the API module
vi.mock("../api/polls", () => ({
  pollApi: {
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

import { pollApi } from "../api/polls";

describe("pollStore (Zustand)", () => {
  beforeEach(() => {
    // Reset store between tests
    usePollStore.setState({ polls: [], loading: false, error: null });
    vi.clearAllMocks();
  });

  it("starts with empty state", () => {
    const state = usePollStore.getState();
    expect(state.polls).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("fetchPolls sets loading then stores results", async () => {
    const mockPolls = [
      { _id: "1", title: "Test Poll", options: [], shareId: "abc" },
    ];
    (pollApi.getAll as any).mockResolvedValue({ results: mockPolls });

    const { fetchPolls } = usePollStore.getState();
    await fetchPolls();

    const state = usePollStore.getState();
    expect(state.polls).toEqual(mockPolls);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("fetchPolls sets error on failure", async () => {
    (pollApi.getAll as any).mockRejectedValue(new Error("Network error"));

    const { fetchPolls } = usePollStore.getState();
    await fetchPolls();

    const state = usePollStore.getState();
    expect(state.polls).toEqual([]);
    expect(state.error).toBe("Could not fetch polls");
    expect(state.loading).toBe(false);
  });

  it("deletePoll removes poll from store", async () => {
    usePollStore.setState({
      polls: [
        { _id: "1", title: "Keep" } as any,
        { _id: "2", title: "Delete" } as any,
      ],
    });
    (pollApi.delete as any).mockResolvedValue({ success: true });

    const { deletePoll } = usePollStore.getState();
    await deletePoll("2");

    const state = usePollStore.getState();
    expect(state.polls).toHaveLength(1);
    expect(state.polls[0]._id).toBe("1");
  });

  it("reset clears everything", () => {
    usePollStore.setState({
      polls: [{ _id: "1" } as any],
      loading: true,
      error: "something",
    });

    usePollStore.getState().reset();

    const state = usePollStore.getState();
    expect(state.polls).toEqual([]);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });
});
