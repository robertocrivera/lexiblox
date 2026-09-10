/**
 * LexiBlox — Daily Streak Controller
 * Calculates daily consecutive logins and streak bonuses
 */

const LexiStreak = {
  STREAK_BONUS: 20, // LexiCoins per streak day bonus

  /**
   * Evaluates login continuity
   */
  updateStreak() {
    const student = window.LexiState ? window.LexiState.getStudent() : null;
    if (!student) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const lastActive = student.last_active;

    if (!lastActive) {
      this.saveStreak(student.id, 1, todayStr);
      return;
    }

    if (lastActive === todayStr) {
      // Already logged in today
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (lastActive === yesterdayStr) {
      // Continuous streak
      const newStreak = (student.streak_days || 1) + 1;
      this.saveStreak(student.id, newStreak, todayStr);
      // Give bonus
      window.LexiState.rewardStudent(this.STREAK_BONUS, 10);
      console.log(`🔥 [LexiStreak] ¡Racha continuada! Días: ${newStreak}`);
    } else {
      // Streak broken, reset to 1
      this.saveStreak(student.id, 1, todayStr);
      console.log('🔥 [LexiStreak] Racha reiniciada a 1.');
    }
  },

  saveStreak(studentId, streakDays, dateStr) {
    if (window.LexiDB) {
      window.LexiDB.execute(
        'UPDATE students SET streak_days = ?, last_active = ? WHERE id = ?',
        [streakDays, dateStr, studentId]
      );
    }
  }
};

window.LexiStreak = LexiStreak;
