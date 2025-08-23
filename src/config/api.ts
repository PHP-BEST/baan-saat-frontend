import { API_ROOT_DEV, API_ROOT_LOCAL, API_ROOT_PROD, NODE_ENV } from './env';

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const API_ROOT =
  NODE_ENV == 'production'
    ? API_ROOT_PROD
    : NODE_ENV == 'development'
      ? API_ROOT_DEV
      : API_ROOT_LOCAL;
