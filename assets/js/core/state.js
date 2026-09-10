/**
 * LexiBlox — State Management & Reactive Session Store
 */

const LexiState = {
  CURRENT_USER_KEY: 'lexiblox_active_session',

  // Current session
  currentUser: null,
  role: null, // 'student' | 'teacher'

  init() {
    const raw = localStorage.getItem(this.CURRENT_USER_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.currentUser = parsed.user;
        this.role = parsed.role;
      } catch (e) {
        console.warn('Error reading session:', e);
      }
    }
  },

  setSession(user, role) {
    this.currentUser = user;
    this.role = role;
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({ user, role }));
  },

  clearSession() {
    this.currentUser = null;
    this.role = null;
    localStorage.removeItem(this.CURRENT_USER_KEY);
  },

  getStudent() {
    if (this.role === 'student' && this.currentUser) {
      // Refresh with fresh database values
      const rows = LexiDB.query('SELECT * FROM students WHERE id = ?', [this.currentUser.id]);
      if (rows.length > 0) {
        this.currentUser = rows[0];
      }
      return this.currentUser;
    }
    return null;
  },

  getTeacher() {
    if (this.role === 'teacher') return this.currentUser;
    return null;
  },

  /**
   * Awards coins and XP to the student, handles level ups
   */
  rewardStudent(coins, xp) {
    const student = this.getStudent();
    if (!student) return null;

    const oldLevel = student.level;
    const newCoins = (student.lexi_coins || 0) + coins;
    const newXp = (student.xp || 0) + xp;
    const newLevel = Math.floor(newXp / 300) + 1;

    LexiDB.execute(
      'UPDATE students SET lexi_coins = lexi_coins + ?, xp = xp + ? WHERE id = ?',
      [coins, xp, student.id]
    );

    // Refresh state
    this.currentUser = this.getStudent();
    const leveledUp = newLevel > oldLevel;

    // Trigger visual toast if DOM exists
    if (typeof showRewardToast === 'function') {
      showRewardToast(coins, xp, leveledUp ? newLevel : null);
    }

    return { coins: newCoins, xp: newXp, level: newLevel, leveledUp };
  }
};

// Auto initialize state
LexiState.init();
window.LexiState = LexiState;
