/**
 * LexiBlox — Teacher Student Management Logic
 */

const TeacherStudents = {
  init() {
    this.renderStudents();
  },

  renderStudents(filterText = '') {
    const tableBody = document.getElementById('studentsListTable');
    if (!tableBody) return;

    let students = window.LexiDB.query('SELECT * FROM students ORDER BY name ASC');

    if (filterText) {
      const q = filterText.toLowerCase();
      students = students.filter(s => s.name.toLowerCase().includes(q) || s.username.toLowerCase().includes(q));
    }

    tableBody.innerHTML = '';

    students.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <strong>${s.name}</strong>
        </td>
        <td><code>@${s.username}</code></td>
        <td>Nv. ${s.level || 1}</td>
        <td>${s.xp || 0} XP</td>
        <td>🪙 ${s.lexi_coins || 0}</td>
        <td>🔥 ${s.streak_days || 0}</td>
        <td>
          <button onclick="TeacherStudents.resetProgress(${s.id})" class="btn-play ghost-btn" style="padding: 0.3rem 0.6rem; font-size: 0.78rem;">
            Reiniciar Misiones
          </button>
        </td>
      `;
      tableBody.appendChild(tr);
    });
  },

  resetProgress(studentId) {
    if (confirm('¿Deseas reiniciar las misiones de este estudiante para una nueva práctica?')) {
      window.LexiDB.execute('UPDATE students SET xp = 0, level = 1 WHERE id = ?', [studentId]);
      alert('Progreso reiniciado correctamente.');
      this.renderStudents();
    }
  },

  addNewStudent(name, username, pin) {
    if (!name || !username || !pin) return false;
    window.LexiDB.execute(
      'INSERT INTO students (group_id, name, username, password, avatar_skin, lexi_coins, xp, level, streak_days) VALUES (1, ?, ?, ?, "brixo", 50, 0, 1, 1)',
      [name.trim(), username.trim().toLowerCase(), pin.trim()]
    );
    this.renderStudents();
    return true;
  }
};

window.TeacherStudents = TeacherStudents;
