/**
 * LexiBlox — Teacher Mission Administrator
 */

const TeacherMissionsAdmin = {
  init() {
    this.renderMissions();
  },

  renderMissions() {
    const container = document.getElementById('missionsListContainer');
    if (!container) return;

    const missions = window.LexiDB.query('SELECT * FROM missions ORDER BY id ASC');
    container.innerHTML = '';

    missions.forEach(m => {
      const card = document.createElement('div');
      card.className = 'kpi-card';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.innerHTML = `
        <div>
          <h3 style="font-size: 1.15rem; color: #f9fafb;">${m.title}</h3>
          <p style="color: #9ca3af; font-size: 0.85rem;">${m.description}</p>
          <span style="color: #38bdf8; font-size: 0.8rem;">Palabras: <code>${m.target_words}</code></span>
        </div>
        <div style="text-align: right;">
          <span class="status-tag status-active">Recompensa: +${m.coin_reward} 🪙</span>
        </div>
      `;
      container.appendChild(card);
    });
  }
};

window.TeacherMissionsAdmin = TeacherMissionsAdmin;
