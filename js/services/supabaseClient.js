// Lightweight Supabase REST + Auth client (no SDK required)
import {
  SUPABASE_AUTH_URL,
  SUPABASE_REST_URL,
  SUPABASE_ANON_KEY,
  supabaseHeaders,
} from '../config/supabase.js';

const SESSION_KEY = 'nova_supabase_session';

export function getStoredSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/** Sign up with email/password. user_metadata: { name, role } */
export async function supabaseSignUp({ email, password, name, role }) {
  const res = await fetch(`${SUPABASE_AUTH_URL}/signup`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify({
      email,
      password,
      data: { name: name || '', role: role || 'CEO' },
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error_description || data.msg || data.message || 'Signup failed';
    throw new Error(msg);
  }
  // If email confirmation is on, session may be null
  if (data.access_token) {
    const session = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at || null,
      user: data.user || data,
    };
    saveSession(session);
    return { session, user: mapUser(session.user), needsConfirmation: false };
  }
  return {
    session: null,
    user: data.user ? mapUser(data.user) : null,
    needsConfirmation: true,
    message: 'Check your email to confirm your account, then sign in.',
  };
}

/** Login with email/password */
export async function supabaseSignIn({ email, password }) {
  const res = await fetch(`${SUPABASE_AUTH_URL}/token?grant_type=password`, {
    method: 'POST',
    headers: supabaseHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.error_description || data.msg || data.message || 'Login failed';
    throw new Error(msg);
  }
  const session = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at || null,
    user: data.user,
  };
  saveSession(session);
  return { session, user: mapUser(data.user) };
}

/** Logout */
export async function supabaseSignOut() {
  const session = getStoredSession();
  try {
    if (session?.access_token) {
      await fetch(`${SUPABASE_AUTH_URL}/logout`, {
        method: 'POST',
        headers: supabaseHeaders(session.access_token),
      });
    }
  } catch (e) {
    console.warn('Supabase logout:', e);
  }
  clearSession();
}

/** GET current user from token */
export async function supabaseGetUser() {
  const session = getStoredSession();
  if (!session?.access_token) return null;
  const res = await fetch(`${SUPABASE_AUTH_URL}/user`, {
    headers: supabaseHeaders(session.access_token),
  });
  if (!res.ok) {
    clearSession();
    return null;
  }
  const user = await res.json();
  return mapUser(user);
}

/** Generic REST select (table must exist + RLS allow) */
export async function supabaseFrom(table, { select = '*', limit = 50, filters = '' } = {}) {
  const session = getStoredSession();
  const qs = new URLSearchParams();
  qs.set('select', select);
  if (limit) qs.set('limit', String(limit));
  let url = `${SUPABASE_REST_URL}/${table}?${qs.toString()}`;
  if (filters) url += `&${filters}`;
  const res = await fetch(url, {
    headers: {
      ...supabaseHeaders(session?.access_token),
      Prefer: 'return=representation',
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `REST ${res.status}`);
  }
  return res.json();
}

function mapUser(u) {
  if (!u) return null;
  const meta = u.user_metadata || {};
  return {
    id: u.id,
    email: u.email,
    name: meta.name || u.email?.split('@')[0] || 'User',
    role: meta.role || 'CEO',
    provider: 'supabase',
  };
}

export { SUPABASE_ANON_KEY, SUPABASE_REST_URL };
