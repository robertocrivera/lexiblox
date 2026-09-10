/**
 * LexiBlox — World Map Component Logic
 * Renders zones, checks XP unlocking, updates student HUD
 */

function initWorldMap() {
  const student = LexiState.getStudent();
  if (!student) return;

  // Update HUD
  document.getElementById('hudCoins').textContent = student.lexi_coins || 0;
  document.getElementById('hudStreak').textContent = student.streak_days || 1;
  document.getElementById('hudLevel').textContent = student.level || 1;
  document.getElementById('hudXp').textContent = student.xp || 0;
  document.getElementById('studentNameGreeting').textContent = student.name;

  // Fetch zones from SQLite
  const zones = LexiDB.query('SELECT * FROM zones ORDER BY id ASC');
  const grid = document.getElementById('zonesGrid');
  grid.innerHTML = '';

  zones.forEach(zone => {
    const isUnlocked = (student.xp || 0) >= (zone.required_xp || 0);
    const tile = document.createElement('article');
    tile.className = `zone-tile ${isUnlocked ? 'unlocked' : 'locked'}`;

    if (isUnlocked && zone.id === 1) {
      tile.classList.add('active-quest');
    }

    tile.innerHTML = `
      <span class="zone-status-badge">${isUnlocked ? '🔓 Libre' : '🔒 Bloqueado'}</span>
      <div class="zone-icon">${zone.icon}</div>
      <h3 class="zone-name-en">${zone.name}</h3>
      <p class="zone-name-es">${zone.title_es}</p>
      <div class="zone-progress-bar">
        <div class="zone-progress-fill" style="width: ${isUnlocked ? (zone.id === 1 ? '50%' : '25%') : '0%'}; background: ${zone.theme_color};"></div>
      </div>
      <span class="zone-req-xp">${isUnlocked ? '⭐ Disponible' : 'Requiere ' + zone.required_xp + ' XP'}</span>
    `;

    if (isUnlocked) {
      tile.addEventListener('click', () => {
        window.location.href = `mission.html?zone_id=${zone.id}`;
      });
    } else {
      tile.addEventListener('click', () => {
        alert(`¡Aún no tienes suficiente XP para este mundo! Necesitas ${zone.required_xp} XP. ¡Completa misiones anteriores con Brixo! 🌟`);
      });
    }

    grid.appendChild(tile);
  });
}
