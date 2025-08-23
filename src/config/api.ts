import { API_ROOT_DEV, API_ROOT_LOCAL, API_ROOT_PROD } from './env';

export const API_ROOT = (() => {
  // Local development
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    console.log('🏠 Using LOCAL API 🏠');
    return API_ROOT_LOCAL;
  }

  // Development deployment (URL contains "git-developer")
  if (window.location.hostname.includes('git-developer')) {
    console.log('🔧 Using DEVELOPMENT API 🔧');
    return API_ROOT_DEV;
  }

  // Production deployment
  console.log('🚀 Using PRODUCTION API 🚀');
  return API_ROOT_PROD;
})();

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
