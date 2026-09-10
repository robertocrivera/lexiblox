/**
 * LexiBlox — Database Layer (SQLite via WebAssembly / LocalStorage Fallback)
 * Handles tables, queries, seeds and persistent state.
 */

const LexiDB = {
  db: null,
  isSqliteReady: false,
  STORAGE_KEY: 'lexiblox_db_data',

  /**
   * Initializes SQLite or the local relational engine.
   */
  async init() {
    console.log('🚀 [LexiDB] Inicializando motor de base de datos...');
    
    // Check if SQL.js (WASM) is available
    if (typeof window.initSqlJs === 'function') {
      try {
        const SQL = await window.initSqlJs({
          locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });

        const savedData = localStorage.getItem(this.STORAGE_KEY);
        if (savedData) {
          const uInt8Array = new Uint8Array(JSON.parse(savedData));
          this.db = new SQL.Database(uInt8Array);
          console.log('📦 [LexiDB] Base de datos SQLite cargada desde almacenamiento persistente.');
        } else {
          this.db = new SQL.Database();
          this.createTables();
          this.seedInitialData();
          this.save();
          console.log('✨ [LexiDB] Nueva base de datos SQLite creada e inicializada con éxito.');
        }
        this.isSqliteReady = true;
        return true;
      } catch (err) {
        console.warn('⚠️ [LexiDB] SQLite WASM falló o no se pudo cargar la red, usando Storage Relacional:', err);
      }
    }

    // Fallback: Ultra-reliable relational store modeled exactly like SQLite tables
    this.initFallbackEngine();
    return true;
  },

  /**
   * Defines schema tables in SQLite
   */
  createTables() {
    if (!this.db) return;
    const schema = `
      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        school TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS groups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER,
        name TEXT NOT NULL,
        grade TEXT,
        code TEXT UNIQUE
      );

      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        group_id INTEGER,
        name TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        avatar_skin TEXT DEFAULT 'brixo',
        lexi_coins INTEGER DEFAULT 150,
        xp INTEGER DEFAULT 320,
        level INTEGER DEFAULT 2,
        streak_days INTEGER DEFAULT 4,
        last_active DATE
      );

      CREATE TABLE IF NOT EXISTS zones (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        title_es TEXT NOT NULL,
        category TEXT NOT NULL,
        icon TEXT NOT NULL,
        theme_color TEXT NOT NULL,
        required_xp INTEGER DEFAULT 0,
        total_missions INTEGER DEFAULT 4
      );

      CREATE TABLE IF NOT EXISTS missions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        zone_id INTEGER,
        title TEXT NOT NULL,
        description TEXT,
        target_words TEXT,
        xp_reward INTEGER DEFAULT 50,
        coin_reward INTEGER DEFAULT 25,
        completed INTEGER DEFAULT 0
      );

      CREATE TABLE IF NOT EXISTS student_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        mission_id INTEGER,
        stars INTEGER DEFAULT 0,
        high_score INTEGER DEFAULT 0,
        completed INTEGER DEFAULT 0,
        completed_at DATETIME
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mission_id INTEGER,
        question TEXT NOT NULL,
        word_en TEXT NOT NULL,
        word_es TEXT NOT NULL,
        options_json TEXT NOT NULL,
        correct_index INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS quiz_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        quiz_id INTEGER,
        student_answer INTEGER,
        is_correct INTEGER,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT NOT NULL,
        description TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS student_badges (
        student_id INTEGER,
        badge_id INTEGER,
        unlocked_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    this.db.run(schema);
  },

  /**
   * Populate initial demo data
   */
  seedInitialData() {
    if (!this.db) return;

    // Docente Demo
    this.db.run(`
      INSERT INTO teachers (name, email, password, school)
      VALUES ('Prof. María López', 'prof.maria@escuela.com', 'profe123', 'Colegio Innova Kids')
    `);

    // Grupos
    this.db.run(`
      INSERT INTO groups (teacher_id, name, grade, code)
      VALUES (1, 'Segundo Grado A', '2° Primaria', 'LEXI-2A')
    `);

    // Estudiantes Demo
    this.db.run(`
      INSERT INTO students (group_id, name, username, password, avatar_skin, lexi_coins, xp, level, streak_days)
      VALUES 
      (1, 'Sofía González', 'sofia', '1234', 'brixo', 280, 680, 3, 5),
      (1, 'Carlos Martínez', 'carlos', '1234', 'zippy', 190, 420, 2, 3),
      (1, 'Mateo Díaz', 'mateo', '1234', 'lexo', 350, 950, 4, 7),
      (1, 'Valentina Ruiz', 'vale', '1234', 'brixo', 80, 160, 1, 1)
    `);

    // Zonas de aprendizaje
    const zones = [
      [1, 'Color Jungle', 'Jungla de Colores', 'colors', '🌿', '#10b981', 0, 4],
      [2, 'Number Mountain', 'Montaña de Números', 'numbers', '🔢', '#3b82f6', 150, 4],
      [3, 'Animal Safari', 'Sabana de Animales', 'animals', '🦁', '#f59e0b', 400, 4],
      [4, 'Clothing City', 'Ciudad de la Ropa', 'clothes', '👕', '#8b5cf6', 700, 4],
      [5, 'Family Home', 'Pueblo de la Familia', 'family', '🏡', '#ec4899', 1100, 4],
      [6, 'Food Garden', 'Jardín de Comidas', 'food', '🍎', '#ef4444', 1600, 4],
      [7, 'Time Tower', 'Torre del Tiempo', 'time', '⏰', '#06b6d4', 2200, 4],
      [8, 'Cosmo Sentences', 'Estación Espacial', 'phrases', '🚀', '#6366f1', 3000, 4]
    ];

    zones.forEach(z => {
      this.db.run(
        `INSERT INTO zones (id, name, title_es, category, icon, theme_color, required_xp, total_missions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        z
      );
    });

    // Misiones iniciales para Zona 1 (Colores) y Zona 2 (Números)
    const missions = [
      [1, 1, 'Primary Colors (Rojo, Azul, Amarillo)', 'Descubre los 3 colores primarios con Brixo', 'red,blue,yellow', 50, 25, 1],
      [2, 1, 'Nature Colors (Verde, Café, Naranja)', 'Explora la vegetación y aprende nuevos tonos', 'green,brown,orange', 60, 30, 1],
      [3, 1, 'Magic Palette (Morado, Rosa, Blanco)', 'Mezcla los bloques mágicos de colores', 'purple,pink,white', 70, 35, 0],
      [4, 1, 'Color Boss: Reto de Vox', 'Vence al villano Vox nombrando todos los colores', 'black,gold,silver', 100, 50, 0],
      
      [5, 2, 'Counting 1 to 5', 'Aprende los primeros números con Zippy', 'one,two,three,four,five', 50, 25, 0],
      [6, 2, 'Counting 6 to 10', 'Avanza hacia la cima de la montaña', 'six,seven,eight,nine,ten', 60, 30, 0],
      [7, 2, 'Counting 11 to 20', 'Números intermedios para exploradores expertos', 'eleven,twelve,fifteen,twenty', 80, 40, 0],
      [8, 2, 'Math Adventure: Reto de Vox', 'Resuelve sumas básicas en inglés con Vox', 'plus,equals,numbers', 120, 60, 0]
    ];

    missions.forEach(m => {
      this.db.run(
        `INSERT INTO missions (id, zone_id, title, description, target_words, xp_reward, coin_reward, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        m
      );
    });

    // Quizzes interactivos
    const quizzes = [
      [1, 1, '¿Cuál de estos cubos es RED?', 'RED', 'Rojo', JSON.stringify(['Rojo 🔴', 'Azul 🔵', 'Verde 🟢', 'Amarillo 🟡']), 0],
      [2, 1, '¿Cómo se dice "Azul" en inglés?', 'BLUE', 'Azul', JSON.stringify(['Yellow', 'Blue', 'Green', 'Purple']), 1],
      [3, 1, 'Brixo encontró una manzana de color GREEN. ¿Qué significa?', 'GREEN', 'Verde', JSON.stringify(['Verde', 'Rojo', 'Negro', 'Rosa']), 0],
      [4, 1, 'Stella tiene una estrella YELLOW. ¿De qué color es?', 'YELLOW', 'Amarillo', JSON.stringify(['Blanco', 'Morado', 'Amarillo', 'Azul']), 2],
      
      [5, 5, '¿Qué número representa la palabra "THREE"?', 'THREE', 'Tres', JSON.stringify(['1', '2', '3', '5']), 2],
      [6, 5, 'How do you say "cinco" in English?', 'FIVE', 'Cinco', JSON.stringify(['Four', 'Five', 'Six', 'Seven']), 1],
      [7, 5, 'Zippy cuenta: "One, Two, Three, ... ¿qué número sigue?"', 'FOUR', 'Cuatro', JSON.stringify(['Ten', 'Four', 'Eight', 'Two']), 1]
    ];

    quizzes.forEach(q => {
      this.db.run(
        `INSERT INTO quizzes (id, mission_id, question, word_en, word_es, options_json, correct_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        q
      );
    });

    // Badges
    const badges = [
      [1, 'Primer Paso Blox', '🌟', 'Completa tu primera misión en LexiBlox'],
      [2, 'Racha Imparable', '🔥', 'Mantén una racha de 5 días seguidos'],
      [3, 'Cazador de Vox', '🎯', 'Gana un quiz con 100% de respuestas correctas'],
      [4, 'Aventurero del Espacio', '🚀', 'Desbloquea la Zona Espacial Intermedia'],
      [5, 'Rey de las Monedas', '👑', 'Acumula más de 300 LexiCoins']
    ];

    badges.forEach(b => {
      this.db.run(`INSERT INTO badges (id, name, icon, description) VALUES (?, ?, ?, ?)`, b);
    });

    // Unlocked badges for Sofia
    this.db.run(`INSERT INTO student_badges (student_id, badge_id) VALUES (1, 1), (1, 2), (1, 3)`);
  },

  /**
   * Save database buffer to LocalStorage
   */
  save() {
    if (this.db && this.isSqliteReady) {
      try {
        const binaryArray = this.db.export();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(binaryArray)));
        return true;
      } catch (e) {
        console.error('Error saving SQLite DB:', e);
      }
    } else {
      localStorage.setItem(this.STORAGE_KEY + '_fallback', JSON.stringify(this.fallbackStore));
    }
  },

  /**
   * Execute SQL Query returning rows
   */
  query(sql, params = []) {
    if (this.db && this.isSqliteReady) {
      try {
        const stmt = this.db.prepare(sql);
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
      } catch (err) {
        console.error('SQL Query Error:', err, sql);
        return [];
      }
    }
    return this.fallbackQuery(sql, params);
  },

  /**
   * Execute INSERT, UPDATE, DELETE
   */
  execute(sql, params = []) {
    if (this.db && this.isSqliteReady) {
      try {
        this.db.run(sql, params);
        this.save();
        return true;
      } catch (err) {
        console.error('SQL Execute Error:', err, sql);
        return false;
      }
    }
    const result = this.fallbackExecute(sql, params);
    this.save();
    return result;
  },

  /* =========================================================================
     Fallback Engine (Zero-dependency relational replica if offline/blocked)
     ========================================================================= */
  initFallbackEngine() {
    const saved = localStorage.getItem(this.STORAGE_KEY + '_fallback');
    if (saved) {
      this.fallbackStore = JSON.parse(saved);
      console.log('📦 [LexiDB] Store relacional cargado desde LocalStorage.');
    } else {
      this.fallbackStore = {
        teachers: [
          { id: 1, name: 'Prof. María López', email: 'prof.maria@escuela.com', password: 'profe123', school: 'Colegio Innova Kids' }
        ],
        groups: [
          { id: 1, teacher_id: 1, name: 'Segundo Grado A', grade: '2° Primaria', code: 'LEXI-2A' }
        ],
        students: [
          { id: 1, group_id: 1, name: 'Sofía González', username: 'sofia', password: '1234', avatar_skin: 'brixo', lexi_coins: 280, xp: 680, level: 3, streak_days: 5 },
          { id: 2, group_id: 1, name: 'Carlos Martínez', username: 'carlos', password: '1234', avatar_skin: 'zippy', lexi_coins: 190, xp: 420, level: 2, streak_days: 3 },
          { id: 3, group_id: 1, name: 'Mateo Díaz', username: 'mateo', password: '1234', avatar_skin: 'lexo', lexi_coins: 350, xp: 950, level: 4, streak_days: 7 },
          { id: 4, group_id: 1, name: 'Valentina Ruiz', username: 'vale', password: '1234', avatar_skin: 'brixo', lexi_coins: 80, xp: 160, level: 1, streak_days: 1 }
        ],
        zones: [
          { id: 1, name: 'Color Jungle', title_es: 'Jungla de Colores', category: 'colors', icon: '🌿', theme_color: '#10b981', required_xp: 0, total_missions: 4 },
          { id: 2, name: 'Number Mountain', title_es: 'Montaña de Números', category: 'numbers', icon: '🔢', theme_color: '#3b82f6', required_xp: 150, total_missions: 4 },
          { id: 3, name: 'Animal Safari', title_es: 'Sabana de Animales', category: 'animals', icon: '🦁', theme_color: '#f59e0b', required_xp: 400, total_missions: 4 },
          { id: 4, name: 'Clothing City', title_es: 'Ciudad de la Ropa', category: 'clothes', icon: '👕', theme_color: '#8b5cf6', required_xp: 700, total_missions: 4 },
          { id: 5, name: 'Family Home', title_es: 'Pueblo de la Familia', category: 'family', icon: '🏡', theme_color: '#ec4899', required_xp: 1100, total_missions: 4 },
          { id: 6, name: 'Food Garden', title_es: 'Jardín de Comidas', category: 'food', icon: '🍎', theme_color: '#ef4444', required_xp: 1600, total_missions: 4 },
          { id: 7, name: 'Time Tower', title_es: 'Torre del Tiempo', category: 'time', icon: '⏰', theme_color: '#06b6d4', required_xp: 2200, total_missions: 4 },
          { id: 8, name: 'Cosmo Sentences', title_es: 'Estación Espacial', category: 'phrases', icon: '🚀', theme_color: '#6366f1', required_xp: 3000, total_missions: 4 }
        ],
        missions: [
          { id: 1, zone_id: 1, title: 'Primary Colors (Rojo, Azul, Amarillo)', description: 'Descubre los 3 colores primarios con Brixo', target_words: 'red,blue,yellow', xp_reward: 50, coin_reward: 25, completed: 1 },
          { id: 2, zone_id: 1, title: 'Nature Colors (Verde, Café, Naranja)', description: 'Explora la vegetación y aprende nuevos tonos', target_words: 'green,brown,orange', xp_reward: 60, coin_reward: 30, completed: 1 },
          { id: 3, zone_id: 1, title: 'Magic Palette (Morado, Rosa, Blanco)', description: 'Mezcla los bloques mágicos de colores', target_words: 'purple,pink,white', xp_reward: 70, coin_reward: 35, completed: 0 },
          { id: 4, zone_id: 1, title: 'Color Boss: Reto de Vox', description: 'Vence al villano Vox nombrando todos los colores', target_words: 'black,gold,silver', xp_reward: 100, coin_reward: 50, completed: 0 },
          { id: 5, zone_id: 2, title: 'Counting 1 to 5', description: 'Aprende los primeros números con Zippy', target_words: 'one,two,three,four,five', xp_reward: 50, coin_reward: 25, completed: 0 },
          { id: 6, zone_id: 2, title: 'Counting 6 to 10', description: 'Avanza hacia la cima de la montaña', target_words: 'six,seven,eight,nine,ten', xp_reward: 60, coin_reward: 30, completed: 0 },
          { id: 7, zone_id: 2, title: 'Counting 11 to 20', description: 'Números intermedios para exploradores expertos', target_words: 'eleven,twelve,fifteen,twenty', xp_reward: 80, coin_reward: 40, completed: 0 },
          { id: 8, zone_id: 2, title: 'Math Adventure: Reto de Vox', description: 'Resuelve sumas básicas en inglés con Vox', target_words: 'plus,equals,numbers', xp_reward: 120, coin_reward: 60, completed: 0 }
        ],
        quizzes: [
          { id: 1, mission_id: 1, question: '¿Cuál de estos cubos es RED?', word_en: 'RED', word_es: 'Rojo', options_json: JSON.stringify(['Rojo 🔴', 'Azul 🔵', 'Verde 🟢', 'Amarillo 🟡']), correct_index: 0 },
          { id: 2, mission_id: 1, question: '¿Cómo se dice "Azul" en inglés?', word_en: 'BLUE', word_es: 'Azul', options_json: JSON.stringify(['Yellow', 'Blue', 'Green', 'Purple']), correct_index: 1 },
          { id: 3, mission_id: 1, question: 'Brixo encontró una manzana de color GREEN. ¿Qué significa?', word_en: 'GREEN', word_es: 'Verde', options_json: JSON.stringify(['Verde', 'Rojo', 'Negro', 'Rosa']), correct_index: 0 },
          { id: 4, mission_id: 1, question: 'Stella tiene una estrella YELLOW. ¿De qué color es?', word_en: 'YELLOW', word_es: 'Amarillo', options_json: JSON.stringify(['Blanco', 'Morado', 'Amarillo', 'Azul']), correct_index: 2 },
          { id: 5, mission_id: 5, question: '¿Qué número representa la palabra "THREE"?', word_en: 'THREE', word_es: 'Tres', options_json: JSON.stringify(['1', '2', '3', '5']), correct_index: 2 },
          { id: 6, mission_id: 5, question: 'How do you say "cinco" in English?', word_en: 'FIVE', word_es: 'Cinco', options_json: JSON.stringify(['Four', 'Five', 'Six', 'Seven']), correct_index: 1 },
          { id: 7, mission_id: 5, question: 'Zippy cuenta: "One, Two, Three, ... ¿qué número sigue?"', word_en: 'FOUR', word_es: 'Cuatro', options_json: JSON.stringify(['Ten', 'Four', 'Eight', 'Two']), correct_index: 1 }
        ],
        badges: [
          { id: 1, name: 'Primer Paso Blox', icon: '🌟', description: 'Completa tu primera misión en LexiBlox' },
          { id: 2, name: 'Racha Imparable', icon: '🔥', description: 'Mantén una racha de 5 días seguidos' },
          { id: 3, name: 'Cazador de Vox', icon: '🎯', description: 'Gana un quiz con 100% de respuestas correctas' },
          { id: 4, name: 'Aventurero del Espacio', icon: '🚀', description: 'Desbloquea la Zona Espacial Intermedia' },
          { id: 5, name: 'Rey de las Monedas', icon: '👑', description: 'Acumula más de 300 LexiCoins' }
        ],
        student_badges: [
          { student_id: 1, badge_id: 1 },
          { student_id: 1, badge_id: 2 },
          { student_id: 1, badge_id: 3 }
        ],
        quiz_logs: []
      };
      this.save();
    }
  },

  fallbackQuery(sql, params) {
    const cleanSql = sql.trim().toLowerCase();
    
    // Simple table selectors
    for (const table of Object.keys(this.fallbackStore)) {
      if (cleanSql.startsWith(`select * from ${table}`)) {
        if (cleanSql.includes('where id = ?') && params.length > 0) {
          return this.fallbackStore[table].filter(r => r.id === Number(params[0]));
        }
        if (cleanSql.includes('where username = ?') && params.length > 0) {
          return this.fallbackStore[table].filter(r => r.username.toLowerCase() === params[0].toLowerCase());
        }
        if (cleanSql.includes('where email = ?') && params.length > 0) {
          return this.fallbackStore[table].filter(r => r.email.toLowerCase() === params[0].toLowerCase());
        }
        if (cleanSql.includes('where zone_id = ?') && params.length > 0) {
          return this.fallbackStore[table].filter(r => r.zone_id === Number(params[0]));
        }
        if (cleanSql.includes('where mission_id = ?') && params.length > 0) {
          return this.fallbackStore[table].filter(r => r.mission_id === Number(params[0]));
        }
        if (cleanSql.includes('where student_id = ?') && params.length > 0) {
          return this.fallbackStore[table].filter(r => r.student_id === Number(params[0]));
        }
        return [...this.fallbackStore[table]];
      }
    }
    return [];
  },

  fallbackExecute(sql, params) {
    const cleanSql = sql.trim().toLowerCase();
    
    // Updates for student rewards
    if (cleanSql.startsWith('update students set') && cleanSql.includes('where id = ?')) {
      const studentId = Number(params[params.length - 1]);
      const student = this.fallbackStore.students.find(s => s.id === studentId);
      if (student) {
        if (cleanSql.includes('lexi_coins = lexi_coins + ?')) {
          student.lexi_coins += Number(params[0]);
        }
        if (cleanSql.includes('xp = xp + ?')) {
          student.xp += Number(params[1]);
          student.level = Math.floor(student.xp / 300) + 1;
        }
        return true;
      }
    }

    // Insert Quiz Log
    if (cleanSql.startsWith('insert into quiz_logs')) {
      this.fallbackStore.quiz_logs.push({
        id: this.fallbackStore.quiz_logs.length + 1,
        student_id: params[0],
        quiz_id: params[1],
        student_answer: params[2],
        is_correct: params[3],
        timestamp: new Date().toISOString()
      });
      return true;
    }

    return true;
  }
};

// Global export
window.LexiDB = LexiDB;
