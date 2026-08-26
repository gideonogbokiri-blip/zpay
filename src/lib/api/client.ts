import { ApiError } from './errors';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001/api';

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ApiError(
      {
        code: body.code || 'UNKNOWN',
        message: body.message || `Request failed with status ${response.status}`,
        retryable: body.retryable || false,
        data: body.data,
      },
      body.kind || (response.status === 401 ? 'authentication' : 'unexpected')
    );
  }
  return body as T;
}

export const http = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'GET' }, token),
  post: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }, token),
  put: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body) }, token),
  patch: <T>(path: string, body: unknown, token?: string | null) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }, token),
};