/**
 * LexiBlox — Student Rewards, Badges & Skins System
 */

const LexiRewards = {
  // Available avatar skins unlockable with LexiCoins
  SKINS: [
    { id: 'brixo', name: 'Brixo Clásico', price: 0, color: 'linear-gradient(135deg, #60a5fa, #2563eb)', icon: '🟦' },
    { id: 'lexo', name: 'Lexo Sabio', price: 100, color: 'linear-gradient(135deg, #f87171, #ef4444)', icon: '🟥' },
    { id: 'zippy', name: 'Zippy Veloz', price: 150, color: 'linear-gradient(135deg, #fde047, #f59e0b)', icon: '🟨' },
    { id: 'vox', name: 'Vox Púrpura', price: 250, color: 'linear-gradient(135deg, #c084fc, #7c3aed)', icon: '🟪' },
    { id: 'stella', name: 'Stella Mágica', price: 400, color: 'linear-gradient(135deg, #fef08a, #d97706)', icon: '⭐' }
  ],

  /**
   * Awards coins and XP to the student
   */
  grant(coins, xp) {
    if (!window.LexiState) return null;
    const result = window.LexiState.rewardStudent(coins, xp);
    this.checkBadgesToUnlock();
    return result;
  },

  /**
   * Verifies if new achievements should be unlocked in SQLite
   */
  checkBadgesToUnlock() {
    const student = window.LexiState.getStudent();
    if (!student) return;

    // Check coin badge (id 5: >= 300 coins)
    if (student.lexi_coins >= 300) {
      window.LexiDB.execute(
        'INSERT OR IGNORE INTO student_badges (student_id, badge_id) VALUES (?, 5)',
        [student.id]
      );
    }

    // Check streak badge (id 2: >= 5 streak days)
    if (student.streak_days >= 5) {
      window.LexiDB.execute(
        'INSERT OR IGNORE INTO student_badges (student_id, badge_id) VALUES (?, 2)',
        [student.id]
      );
    }
  },

  /**
   * Equips a new avatar skin
   */
  equipSkin(skinId) {
    const student = window.LexiState.getStudent();
    if (!student) return false;

    window.LexiDB.execute('UPDATE students SET avatar_skin = ? WHERE id = ?', [skinId, student.id]);
    window.LexiState.currentUser.avatar_skin = skinId;
    return true;
  }
};

window.LexiRewards = LexiRewards;
