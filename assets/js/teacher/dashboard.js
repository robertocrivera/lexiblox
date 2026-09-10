/**
 * LexiBlox — Teacher Dashboard Logic
 */

function loadDashboardData() {
  const teacher = LexiState.getTeacher();
  if (teacher) {
    document.getElementById('teacherGreeting').textContent = teacher.name;
  }

  // Query students from SQLite
  const students = LexiDB.query('SELECT * FROM students ORDER BY xp DESC');
  
  // KPIs calculation
  const total = students.length;
  let totalCoins = 0;
  let totalStreak = 0;
  let totalLevels = 0;

  students.forEach(s => {
    totalCoins += (s.lexi_coins || 0);
    totalStreak += (s.streak_days || 0);
    totalLevels += (s.level || 1);
  });

  document.getElementById('kpiTotalStudents').textContent = total;
  document.getElementById('kpiTotalCoins').textContent = totalCoins;
  document.getElementById('kpiAvgStreak').textContent = (total > 0 ? (totalStreak / total).toFixed(1) : '0') + ' d';

  // Render Table
  const tbody = document.getElementById('studentsTableBody');
  tbody.innerHTML = '';

  students.forEach(s => {
    const tr = document.createElement('tr');
    const isNeedHelp = (s.xp || 0) < 200;

    tr.innerHTML = `
      <td>
        <div style="display: flex; align-items: center; gap: 0.6rem;">
          <div class="mini-cube" style="background: ${getAvatarColor(s.avatar_skin)}; width: 32px; height: 32px; border-radius: 8px;"></div>
          <strong>${s.name}</strong>
        </div>
      </td>
      <td><code>@${s.username}</code></td>
      <td><span style="color: #60a5fa; font-weight: 800;">Nv. ${s.level || 1}</span></td>
      <td><strong style="color: #c084fc;">${s.xp || 0} XP</strong></td>
      <td><span style="color: #fbbf24; font-weight: 800;">🪙 ${s.lexi_coins || 0}</span></td>
      <td><span style="color: #fb923c; font-weight: 800;">🔥 ${s.streak_days || 0}</span></td>
      <td>
        <span class="status-tag ${isNeedHelp ? 'status-alert' : 'status-active'}">
          ${isNeedHelp ? '⚠️ Refuerzo sugerido' : '● Buen ritmo'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function getAvatarColor(skin) {
  switch (skin) {
    case 'zippy': return 'linear-gradient(135deg, #fde047, #f59e0b)';
    case 'lexo': return 'linear-gradient(135deg, #f87171, #ef4444)';
    case 'vox': return 'linear-gradient(135deg, #c084fc, #7c3aed)';
    default: return 'linear-gradient(135deg, #60a5fa, #2563eb)';
  }
}

function assignMissionNotice() {
  const notice = document.getElementById('assignNotice');
  notice.style.display = 'block';
  setTimeout(() => {
    notice.style.display = 'none';
  }, 4000);
}

function exportSqliteData() {
  const data = JSON.stringify(LexiDB.fallbackStore || {}, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lexiblox_database_backup.json';
  a.click();
  URL.revokeObjectURL(url);
}
