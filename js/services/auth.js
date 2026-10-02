// NOVA CART - Auth: Supabase primary + local demo fallback
import {
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  getStoredSession,
  supabaseGetUser,
} from './supabaseClient.js';

const LOCAL_SESSION = 'nova_cart_active_session';
const USERS_DB_KEY = 'nova_cart_registered_users';

function hashPassword(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'hash_' + Math.abs(hash).toString(16);
}

class AuthService {
  constructor() {
    this.users = this.loadUsers();
    this.activeUser = null;
  }

  loadUsers() {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    const defaultUsers = [
      {
        id: 'USR-001',
        name: 'Rahul Kumar',
        email: 'rahul@novacart.in',
        passwordHash: hashPassword('password123'),
        role: 'CEO',
      },
      {
        id: 'USR-002',
        name: 'Priya Sharma',
        email: 'priya@novacart.in',
        passwordHash: hashPassword('password123'),
        role: 'Operations Manager',
      },
      {
        id: 'USR-003',
        name: 'Satish Kumar',
        email: 'satish@novacart.in',
        passwordHash: hashPassword('password123'),
        role: 'Admin',
      },
    ];
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  async restoreSession() {
    // Prefer Supabase session
    const sb = getStoredSession();
    if (sb?.access_token) {
      try {
        const user = await supabaseGetUser();
        if (user) {
          this.activeUser = user;
          return user;
        }
      } catch (e) {
        console.warn('Supabase session restore failed', e);
      }
    }
    try {
      const raw = localStorage.getItem(LOCAL_SESSION);
      if (raw) {
        this.activeUser = JSON.parse(raw);
        return this.activeUser;
      }
    } catch (e) {}
    return null;
  }

  /** Real Supabase signup */
  async signup({ name, email, password, role = 'CEO' }) {
    try {
      const result = await supabaseSignUp({ email, password, name, role });
      if (result.needsConfirmation) {
        return {
          ok: true,
          needsConfirmation: true,
          message: result.message,
          user: result.user,
        };
      }
      this.activeUser = result.user;
      localStorage.setItem(LOCAL_SESSION, JSON.stringify(result.user));
      return { ok: true, user: result.user, needsConfirmation: false };
    } catch (e) {
      // Fallback: local-only signup if network/Supabase fails
      console.warn('Supabase signup error, trying local:', e.message);
      return this.localSignup({ name, email, password, role });
    }
  }

  localSignup({ name, email, password, role }) {
    const existing = this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) return { ok: false, message: 'Email already registered (local).' };
    const user = {
      id: 'USR-' + Date.now(),
      name,
      email,
      passwordHash: hashPassword(password),
      role,
      provider: 'local',
    };
    this.users.push(user);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(this.users));
    const sessionUser = { id: user.id, name: user.name, email: user.email, role: user.role, provider: 'local' };
    this.activeUser = sessionUser;
    localStorage.setItem(LOCAL_SESSION, JSON.stringify(sessionUser));
    return { ok: true, user: sessionUser, needsConfirmation: false };
  }

  /** Real Supabase login */
  async login({ email, password }) {
    try {
      const result = await supabaseSignIn({ email, password });
      this.activeUser = result.user;
      localStorage.setItem(LOCAL_SESSION, JSON.stringify(result.user));
      return { ok: true, user: result.user };
    } catch (e) {
      // Demo local fallback (rahul@novacart.in / password123)
      const local = this.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() && u.passwordHash === hashPassword(password)
      );
      if (local) {
        const sessionUser = {
          id: local.id,
          name: local.name,
          email: local.email,
          role: local.role,
          provider: 'local',
        };
        this.activeUser = sessionUser;
        localStorage.setItem(LOCAL_SESSION, JSON.stringify(sessionUser));
        return { ok: true, user: sessionUser, message: 'Signed in with local demo account.' };
      }
      return { ok: false, message: e.message || 'Invalid email or password' };
    }
  }

  async logout() {
    try {
      await supabaseSignOut();
    } catch (e) {}
    this.activeUser = null;
    localStorage.removeItem(LOCAL_SESSION);
    localStorage.removeItem('nova_cart_user');
    localStorage.removeItem('nova_cart_logged_in');
  }

  getUser() {
    return this.activeUser;
  }
}

export const auth = new AuthService();
