const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "https://hamlet-unified-complete-2027-production.up.railway.app";

export async function fetchFromAPI(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
    if (!response.ok) throw new Error(`API error ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("? API request failed:", err);
    return { error: true, message: (err as Error).message };
  }
}

// --- Standard Routes ---
export const getCandidates = () => fetchFromAPI("/api/candidates");
export const getPosts = () => fetchFromAPI("/api/posts");
export const getEvents = () => fetchFromAPI("/api/events");
export const getUsers = () => fetchFromAPI("/api/users");
