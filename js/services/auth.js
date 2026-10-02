// NOVA CART - Real Authentication & Session Service
import { db } from './db.js';

const SESSION_KEY = 'nova_cart_active_session';
const USERS_DB_KEY = 'nova_cart_registered_users';

// Simple Hashing function (SHA-256 equivalent simulation)
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
    this.activeUser = this.loadSession();
  }

  loadUsers() {
    try {
      const stored = localStorage.getItem(USERS_DB_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("User DB access issue:", e);
    }

    // Default registered demo users
    const defaultUsers = [
      {
        id: "USR-001",
        name: "Rahul Kumar",
        email: "rahul@novacart.in",
        passwordHash: hashPassword("password123"),
        role: "CEO",
        createdAt: "2026-09-01",
        lastLogin: "2026-10-02 11:30"
      },
      {
        id: "USR-002",
        name: "Priya Sharma",
        email: "priya@novacart.in",
        passwordHash: hashPassword("password123"),
        role: "Operations Manager",
        createdAt: "2026-09-05",
        lastLogin: "2026-10-02 10:15"
      },
      {
        id: "USR-003",
        name: "Satish Kumar",
        email: "satish@novacart.in",
        passwordHash: hashPassword("password123"),
        role: "Admin",
        createdAt: "2026-08-20",
        lastLogin: "2026-10-02 09:00"
      }
    ];

    this.saveUsers(defaultUsers);
    return defaultUsers;
  }

  saveUsers(users = this.users) {
    this.users = users;
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users database:", e);
    }
  }

  loadSession() {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Session access error:", e);
    }
    return null;
  }

  saveSession(user) {
    this.activeUser = user;
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  signup({ name, email, password, role = 'CEO' }) {
    const existing = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error("An account with this email already exists. Please login instead.");
    }

    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      role: role || 'CEO',
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toLocaleString()
    };

    this.users.push(newUser);
    this.saveUsers();
    this.saveSession(newUser);
    return newUser;
  }

  login({ email, password }) {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      throw new Error("Invalid email or password. Please check your credentials or create a new account.");
    }

    if (user.passwordHash !== hashPassword(password)) {
      throw new Error("Incorrect password for " + email + ". Please try again.");
    }

    user.lastLogin = new Date().toLocaleString();
    this.saveUsers();
    this.saveSession(user);
    return user;
  }

  logout() {
    this.saveSession(null);
  }

  getCurrentUser() {
    return this.activeUser;
  }

  isAuthenticated() {
    return this.activeUser !== null;
  }

  getUsersList() {
    return this.users;
  }
}

export const authService = new AuthService();
