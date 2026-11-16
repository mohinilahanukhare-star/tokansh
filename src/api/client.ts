/**
 * Centralized frontend-only REST transport. The UI uses mocked, clearly labeled
 * sample workflows until the separately maintained Python APIs are available.
 * No blockchain credentials, peers or chaincode are accessed from the browser.
 */
export type ApiEnvelope<T> = {
  data: T;
  requestId?: string;
  source?: 'SIMULATED' | 'INDICATIVE' | 'MIXED' | 'DRUNIX_COMMITTED';
  asOf?: string;
};
export type ApiError = { error?: { code: string; message: string; retriable?: boolean }; requestId?: string };
export const API_MODE = import.meta.env.VITE_API_MODE === 'real' ? 'real' : 'mock';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export async function apiRequest<T>(
  path: string,
  options: { method?: 'GET' | 'POST'; body?: unknown; idempotencyKey?: string; signal?: AbortSignal } = {}
): Promise<ApiEnvelope<T>> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.idempotencyKey) headers['Idempotency-Key'] = options.idempotencyKey;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    credentials: 'include',
    signal: options.signal,
  });
  const payload: ApiEnvelope<T> & ApiError = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error?.message || `API failed (${response.status})`);
  }
  return payload;
}
