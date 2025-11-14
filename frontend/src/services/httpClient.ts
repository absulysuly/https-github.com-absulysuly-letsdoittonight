const DEFAULT_API_BASE_URL = 'http://localhost:4000';

export const getApiBaseUrl = () => {
  const fromEnv = import.meta.env.VITE_API_URL as string | undefined;
  return (fromEnv && fromEnv.trim().length > 0) ? fromEnv : DEFAULT_API_BASE_URL;
};

export interface RequestOptions extends RequestInit {
  skipErrorThrow?: boolean;
}

export const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { skipErrorThrow, headers, ...rest } = options;
  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {})
    }
  });

  if (!response.ok) {
    if (skipErrorThrow) {
      return Promise.reject({ status: response.status, message: response.statusText });
    }
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json() as Promise<T>;
};

export const getHealth = () => request<{ ok: boolean }>('/api/health');
export const getCandidateSummary = () => request<{ count: number }>('/api/candidates?summary=true');
export const getAgentStatus = () => request<{ agents: Array<{ agent: string; healthy: boolean; lastRunAt?: string; tasksCompleted: number; }> }>('/api/agent/status');
