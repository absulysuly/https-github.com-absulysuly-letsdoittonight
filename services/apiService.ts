/**
 * Unified API Service — Live + Mock Fallback
 * Connects frontend to the Hamlet Unified backend, but still works offline using mock data.
 */

import {
  MOCK_USERS,
  MOCK_POSTS,
  MOCK_EVENTS,
  MOCK_ARTICLES,
  IRAQI_GOVERNORATES_INFO,
} from "../constants.ts";
import { User, Post, Event, DashboardStats, ParticipationData } from "../types.ts";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://hamlet-unified-complete-2027-production.up.railway.app";

/** --- Core fetch helper with graceful fallback --- */
async function tryRequest<T>(path: string, options?: RequestInit, fallback?: () => T): Promise<T> {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    console.warn(`⚠️ API fallback triggered for ${path}:`, err);
    return fallback ? fallback() : ({} as T);
  }
}

/** --- Example Endpoints --- */

// 🎯 Get all users (live or mock)
export const getUsers = async (): Promise<User[]> =>
  tryRequest("/api/users", undefined, () => MOCK_USERS);

// 🗳️ Get posts (live or mock)
export const getPosts = async (): Promise<Post[]> =>
  tryRequest("/api/posts", undefined, () => MOCK_POSTS);

// 📅 Get events (live or mock)
export const getEvents = async (): Promise<Event[]> =>
  tryRequest("/api/events", undefined, () => MOCK_EVENTS);

// 📰 Get articles (live or mock)
export const getArticles = async () =>
  tryRequest("/api/articles", undefined, () => MOCK_ARTICLES);

// 🧭 Get dashboard stats
export const getDashboardStats = async (): Promise<{
  stats: DashboardStats;
  participation: ParticipationData[];
}> =>
  tryRequest("/api/dashboard/stats", undefined, () => ({
    stats: {
      totalRegisteredVoters: 12500000,
      approvedCandidatesCount: 7769,
      expectedTurnoutPercentage: 65,
    },
    participation: IRAQI_GOVERNORATES_INFO.map((g) => ({
      governorateId: g.id,
      governorateName: g.name,
      estimatedTurnout: parseFloat((40 + Math.random() * 30).toFixed(2)),
    })),
  }));

// ✍️ Create a post
export const createPost = async (data: Partial<Post>) =>
  tryRequest("/api/posts", { method: "POST", body: JSON.stringify(data) }, () => {
    const newPost: Post = {
      id: `mock-${Date.now()}`,
      author: MOCK_USERS[0],
      content: data.content || "Mock content",
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
      type: "Post",
    };
    MOCK_POSTS.unshift(newPost);
    return newPost;
  });

/** --- Utility: Ping backend connection --- */
export const checkBackend = async (): Promise<boolean> => {
  try {
    const res = await fetch(`${BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
};
