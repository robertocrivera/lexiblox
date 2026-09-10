/**
 * LexiBlox — Authentication Service (Students & Teachers)
 */

const LexiAuth = {
  /**
   * Logs in a student by username and 4-digit PIN/password
   */
  loginStudent(username, password) {
    if (!username || !password) return { success: false, message: 'Ingresa tu usuario y contraseña' };

    const students = LexiDB.query(
      'SELECT * FROM students WHERE LOWER(username) = LOWER(?) AND password = ?',
      [username.trim(), password.trim()]
    );

    if (students.length > 0) {
      const student = students[0];
      LexiState.setSession(student, 'student');
      return { success: true, user: student };
    }

    return { success: false, message: 'Usuario o contraseña no encontrados. ¿Probaste con sofia / 1234?' };
  },

  /**
   * Logs in a teacher with email & password
   */
  loginTeacher(email, password) {
    if (!email || !password) return { success: false, message: 'Por favor completa todos los campos' };

    const teachers = LexiDB.query(
      'SELECT * FROM teachers WHERE LOWER(email) = LOWER(?) AND password = ?',
      [email.trim(), password.trim()]
    );

    if (teachers.length > 0) {
      const teacher = teachers[0];
      LexiState.setSession(teacher, 'teacher');
      return { success: true, user: teacher };
    }

    return { success: false, message: 'Credenciales inválidas. Usa prof.maria@escuela.com / profe123' };
  },

  /**
   * Protects pages from unauthenticated access
   */
  requireAuth(requiredRole, redirectUrl) {
    LexiState.init();
    if (!LexiState.currentUser || LexiState.role !== requiredRole) {
      window.location.href = redirectUrl;
    }
  },

  /**
   * Log out current user
   */
  logout(redirectUrl = '../../index.html') {
    LexiState.clearSession();
    window.location.href = redirectUrl;
  }
};

window.LexiAuth = LexiAuth;
