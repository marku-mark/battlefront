/**
 * AdminAuth
 * Handles admin authentication, session storage, and route guarding.
 * OOP Principle: Single Responsibility — auth only.
 */
class AdminAuth {
  #CREDENTIALS = { username: 'admin', password: 'battlefront2025' };
  #SESSION_KEY = 'bct_admin_session';

  constructor() {
    this.onAuthChange = null; // callback
  }

  isAuthenticated() {
    const session = sessionStorage.getItem(this.#SESSION_KEY);
    if (!session) return false;
    try {
      const { expiry } = JSON.parse(session);
      if (Date.now() > expiry) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  login(username, password) {
    if (
      username.trim() === this.#CREDENTIALS.username &&
      password === this.#CREDENTIALS.password
    ) {
      const session = {
        username,
        loginTime: Date.now(),
        expiry: Date.now() + 8 * 60 * 60 * 1000, // 8-hour session
      };
      sessionStorage.setItem(this.#SESSION_KEY, JSON.stringify(session));
      if (this.onAuthChange) this.onAuthChange(true);
      return { success: true };
    }
    return { success: false, error: 'Invalid username or password.' };
  }

  logout() {
    sessionStorage.removeItem(this.#SESSION_KEY);
    if (this.onAuthChange) this.onAuthChange(false);
  }

  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem(this.#SESSION_KEY));
    } catch {
      return null;
    }
  }
}
