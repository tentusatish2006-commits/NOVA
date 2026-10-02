// Supabase project config (publishable key is safe for client-side use with RLS)
export const SUPABASE_URL = 'https://qmtuqspbnubcvylmmsis.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_sQLhjXrrgC77DR9pYKENGg_y0ONA4MW';
export const SUPABASE_REST_URL = `${SUPABASE_URL}/rest/v1`;
export const SUPABASE_AUTH_URL = `${SUPABASE_URL}/auth/v1`;

export function supabaseHeaders(accessToken) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  } else {
    headers.Authorization = `Bearer ${SUPABASE_ANON_KEY}`;
  }
  return headers;
}
