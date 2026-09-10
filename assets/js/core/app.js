/**
 * LexiBlox — Application Bootstrapper & Global Utilities
 */

const LexiApp = {
  version: '1.0.0',
  title: 'LexiBlox',

  /**
   * Initializes database, checks current session and binds global listeners
   */
  async init() {
    console.log(`🚀 [LexiApp v${this.version}] Iniciando plataforma...`);
    
    // Ensure DB is loaded
    if (window.LexiDB && typeof window.LexiDB.init === 'function') {
      await window.LexiDB.init();
    }

    // Ensure session state is active
    if (window.LexiState && typeof window.LexiState.init === 'function') {
      window.LexiState.init();
    }

    this.renderCurrentHUD();
    console.log('✅ [LexiApp] Plataforma inicializada correctamente.');
  },

  /**
   * Updates HUD in any active page if elements exist
   */
  renderCurrentHUD() {
    if (!window.LexiState) return;
    const student = window.LexiState.getStudent();
    if (!student) return;

    const hudCoins = document.getElementById('hudCoins');
    const hudStreak = document.getElementById('hudStreak');
    const hudLevel = document.getElementById('hudLevel');
    const hudXp = document.getElementById('hudXp');

    if (hudCoins) hudCoins.textContent = student.lexi_coins || 0;
    if (hudStreak) hudStreak.textContent = student.streak_days || 1;
    if (hudLevel) hudLevel.textContent = student.level || 1;
    if (hudXp) hudXp.textContent = student.xp || 0;
  },

  /**
   * Play simple audio sound effect (Web Audio API synthesis)
   */
  playSound(type) {
    if (window.LexiSounds && typeof window.LexiSounds.play === 'function') {
      window.LexiSounds.play(type);
    }
  }
};

window.LexiApp = LexiApp;
document.addEventListener('DOMContentLoaded', () => {
  LexiApp.init();
});
