/**
 * LexiBlox — Teacher Classrooms & Groups Management
 */

const TeacherGroups = {
  init() {
    this.renderGroups();
  },

  renderGroups() {
    const container = document.getElementById('groupsContainer');
    if (!container) return;

    const groups = window.LexiDB.query('SELECT * FROM groups');
    container.innerHTML = '';

    groups.forEach(g => {
      const studentCount = window.LexiDB.query('SELECT COUNT(*) as count FROM students WHERE group_id = ?', [g.id]);
      const total = studentCount.length > 0 ? (studentCount[0].count || 4) : 4;

      const card = document.createElement('div');
      card.className = 'kpi-card';
      card.style.flexDirection = 'column';
      card.style.alignItems = 'flex-start';
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
          <h3 style="font-size: 1.3rem; color: #c084fc;">${g.name}</h3>
          <span class="status-tag status-active">Código: ${g.code || 'LEXI-2A'}</span>
        </div>
        <p style="color: #cbd5e1; margin-top: 0.3rem;">Grado: <strong>${g.grade}</strong></p>
        <p style="color: #94a3b8; font-size: 0.85rem;">Total de Alumnos: <strong>${total}</strong></p>
      `;
      container.appendChild(card);
    });
  }
};

window.TeacherGroups = TeacherGroups;
