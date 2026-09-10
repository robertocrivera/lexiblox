/**
 * LexiBlox — Teacher Quiz Analytics & Detailed Reports
 */

const TeacherReports = {
  init() {
    this.renderReports();
  },

  renderReports() {
    const tbody = document.getElementById('reportsTableBody');
    if (!tbody) return;

    const logs = window.LexiDB.fallbackStore ? window.LexiDB.fallbackStore.quiz_logs || [] : [];
    tbody.innerHTML = '';

    if (logs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align: center; color: #9ca3af; padding: 2rem;">
            Aún no hay respuestas de quizzes registradas hoy. ¡Pide a tus alumnos que resuelvan un reto de Vox!
          </td>
        </tr>
      `;
      return;
    }

    logs.forEach(log => {
      const student = window.LexiDB.query('SELECT name FROM students WHERE id = ?', [log.student_id])[0] || { name: 'Estudiante Demo' };
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${student.name}</strong></td>
        <td>Quiz #${log.quiz_id}</td>
        <td><span class="status-tag ${log.is_correct ? 'status-active' : 'status-alert'}">${log.is_correct ? 'Correcto ✅' : 'Incorrecto ❌'}</span></td>
        <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
      `;
      tbody.appendChild(tr);
    });
  }
};

window.TeacherReports = TeacherReports;
