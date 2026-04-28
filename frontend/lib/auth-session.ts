import type { AuthResponseData } from './auth-api';

const AUTH_STORAGE_KEY = 'campusos.auth-session';

export function storeAuthSession(data: AuthResponseData | null) {
  if (typeof window === 'undefined' || !data?.accessToken) {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function readAuthSession(): AuthResponseData | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as AuthResponseData;
  } catch {
    return null;
  }
}

export function readAccessToken() {
  return readAuthSession()?.accessToken || null;
}

export function clearAuthSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}
