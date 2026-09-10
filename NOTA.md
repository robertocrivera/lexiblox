Implementation Plan
🌟 LexiBlox — Plataforma Educativa de Inglés Gamificada
Descripción del Proyecto
LexiBlox es una plataforma web educativa gamificada para enseñar inglés (nivel básico a intermedio) a niños de 6 a 8 años. Su diferenciador principal es que se siente como un videojuego de aventura, no como una clase tradicional. Los niños no estudian: exploran mundos, desbloquean bloques mágicos y salvan el reino con palabras en inglés.

La plataforma tiene dos portales separados:

🧑‍🏫 Portal Docente — Panel de control y seguimiento de alumnos
🧒 Portal Estudiante — El mundo de aventura gamificado
🎮 Nombre Creativo
LexiBlox ✨
"Build your words, build your world"

Logi de Lexicon (vocabulario) + Blox (bloques/juego). Evoca construcción, bloques tipo Minecraft/LEGO, y aprendizaje activo.

🦸 Personajes Originales
En lugar de iconos clásicos, LexiBlox usa personajes propios inspirados en el mundo de los bloques:

Personaje	Nombre	Rol
🟦 Cubo azul parlante	Brixo	Guía/mascota principal del estudiante
🟥 Cubo rojo sabio	Lexo	Maestro de vocabulario, da misiones
🟨 Cubo amarillo veloz	Zippy	Personaje de las misiones de velocidad
🟪 Cubo morado misterioso	Vox	Villano reconvertido que reta al jugador con quizzes
⭐ Estrella dorada	Stella	Diosa de recompensas y puntos
⚙️ Funcionalidades Principales
Portal Estudiante 🧒
Mapa del Mundo en bloques: zonas desbloqueables (jungla, espacio, océano, ciudad)
Cada zona = una categoría de inglés (colores, números, animales, ropa, etc.)
Misiones de Aprendizaje: lecciones cortas tipo flash-card animada con voz y personaje
Mini Quizzes al final de cada misión (arrastrar, seleccionar, escribir)
Sistema de Puntos (LexiCoins) y niveles de experiencia (XP)
Recompensas: skins para tu cubo, insignias, trofeos
Racha de días (streak) con animación especial
Modo Historia: los personajes guían la narrativa
Portal Docente 🧑‍🏫
Inicio de sesión seguro
Panel de alumnos: progreso, puntos, zonas completadas
Asignar misiones o bloquear contenido
Ver reportes de rendimiento por alumno o por grupo
Crear/gestionar grupos (salones)
Historial de quizzes con respuestas correctas/incorrectas
🆕 Novedad del Proyecto
Aspecto	Descripción
Gamificación total	No hay una "lección" visible — todo ocurre dentro de la narrativa del juego
Personajes originales	Cubos con personalidad, no iconos genéricos de stock
Mundo por bloques	Mapa navegable tipo RPG, zonas desbloqueables por logros
Dos portales integrados	Estudiante y Docente en la misma plataforma con SQLite local
Sin dependencias pesadas	Puro HTML + JS + CSS + SQLite (via sql.js), deployable sin servidor
Narrativa continua	El villano Vox lanza los quizzes como "retos del mal" que Brixo debe superar
Recompensas visuales	Skins para el cubo avatar, no solo puntos numéricos
Streak/Racha	Motivación de continuidad con animación especial
🛠️ Stack Tecnológico
Tecnología	Uso
HTML5	Estructura, semántica, canvas
CSS3 + Animaciones	UI gamificada, keyframes, gradientes
JavaScript (Vanilla)	Lógica del juego, routing, estado
SQLite (sql.js)	Base de datos local en el navegador (WASM)
LocalStorage	Sesión activa y caché de estado
Web Animations API	Animaciones de personajes y recompensas
📁 Árbol de Directorio y Archivos

lexiblox/
├── index.html                        # Landing page / selector de portal
├── README.md                         # Documentación del proyecto
│
├── assets/
│   ├── css/
│   │   ├── main.css                  # Estilos globales, variables de color
│   │   ├── game.css                  # Estilos del portal estudiante
│   │   ├── teacher.css               # Estilos del portal docente
│   │   ├── animations.css            # Keyframes y animaciones de personajes
│   │   └── components.css            # Botones, tarjetas, modales reutilizables
│   │
│   ├── js/
│   │   ├── core/
│   │   │   ├── app.js                # Router principal, inicialización
│   │   │   ├── db.js                 # Capa de acceso a SQLite (sql.js)
│   │   │   ├── auth.js               # Autenticación estudiante/docente
│   │   │   └── state.js              # Gestión de estado global
│   │   │
│   │   ├── student/
│   │   │   ├── worldmap.js           # Mapa de zonas desbloqueables
│   │   │   ├── mission.js            # Motor de misiones/lecciones
│   │   │   ├── quiz.js               # Sistema de quizzes interactivos
│   │   │   ├── rewards.js            # LexiCoins, XP, badges, skins
│   │   │   ├── characters.js         # Lógica y animaciones de Brixo, Lexo, Vox
│   │   │   └── streak.js             # Sistema de racha de días
│   │   │
│   │   └── teacher/
│   │       ├── dashboard.js          # Panel principal del docente
│   │       ├── students.js           # Gestión de alumnos
│   │       ├── groups.js             # Gestión de grupos/salones
│   │       ├── reports.js            # Reportes de progreso y quizzes
│   │       └── missions-admin.js     # Asignación de misiones
│   │
│   ├── characters/
│   │   ├── brixo.svg                 # Personaje guía (cubo azul)
│   │   ├── lexo.svg                  # Maestro vocabulario (cubo rojo)
│   │   ├── zippy.svg                 # Cubo veloz amarillo
│   │   ├── vox.svg                   # Villano (cubo morado)
│   │   └── stella.svg                # Diosa de recompensas (estrella)
│   │
│   ├── sounds/
│   │   ├── correct.mp3               # Sonido respuesta correcta
│   │   ├── wrong.mp3                 # Sonido respuesta incorrecta
│   │   ├── levelup.mp3               # Subida de nivel
│   │   ├── coin.mp3                  # Obtención de LexiCoin
│   │   └── click.mp3                 # Click UI
│   │
│   └── icons/
│       ├── favicon.ico
│       └── logo.svg                  # Logo LexiBlox
│
├── pages/
│   ├── student/
│   │   ├── login.html                # Login estudiante (con avatar selector)
│   │   ├── world.html                # Mapa del mundo (zonas)
│   │   ├── mission.html              # Vista de misión/lección activa
│   │   ├── quiz.html                 # Vista de quiz post-misión
│   │   └── profile.html              # Perfil del estudiante (puntos, badges)
│   │
│   └── teacher/
│       ├── login.html                # Login docente
│       ├── dashboard.html            # Panel principal docente
│       ├── students.html             # Lista y detalle de alumnos
│       ├── groups.html               # Gestión de grupos
│       ├── reports.html              # Reportes y analytics
│       └── missions.html             # Administración de misiones
│
├── data/
│   ├── db/
│   │   └── lexiblox.db               # SQLite database (generado en runtime)
│   │
│   └── content/
│       ├── zones.json                # Definición de zonas del mundo
│       ├── missions.json             # Banco de misiones/lecciones
│       ├── quizzes.json              # Banco de preguntas de quizzes
│       └── vocabulary.json           # Banco de vocabulario por categoría
│
└── lib/
    └── sql-wasm.js                   # sql.js (SQLite en WebAssembly)
🗄️ Esquema de Base de Datos (SQLite)
sql

-- Usuarios Docentes
CREATE TABLE teachers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Grupos/Salones
CREATE TABLE groups (
  id INTEGER PRIMARY KEY,
  teacher_id INTEGER REFERENCES teachers(id),
  name TEXT NOT NULL,
  grade TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Estudiantes
CREATE TABLE students (
  id INTEGER PRIMARY KEY,
  group_id INTEGER REFERENCES groups(id),
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_skin TEXT DEFAULT 'default',
  lexi_coins INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_login DATE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Zonas del mundo
CREATE TABLE zones (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  theme TEXT NOT NULL,          -- 'jungle', 'space', 'ocean', 'city'
  unlock_xp INTEGER DEFAULT 0,
  order_index INTEGER
);
-- Misiones
CREATE TABLE missions (
  id INTEGER PRIMARY KEY,
  zone_id INTEGER REFERENCES zones(id),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL,           -- 'vocabulary', 'listening', 'spelling'
  content_json TEXT NOT NULL,   -- JSON con el contenido de la misión
  xp_reward INTEGER DEFAULT 10,
  coin_reward INTEGER DEFAULT 5,
  order_index INTEGER
);
-- Progreso del estudiante por misión
CREATE TABLE student_progress (
  id INTEGER PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  mission_id INTEGER REFERENCES missions(id),
  completed BOOLEAN DEFAULT 0,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at DATETIME,
  UNIQUE(student_id, mission_id)
);
-- Quizzes
CREATE TABLE quizzes (
  id INTEGER PRIMARY KEY,
  mission_id INTEGER REFERENCES missions(id),
  question TEXT NOT NULL,
  type TEXT NOT NULL,           -- 'multiple_choice', 'drag_drop', 'fill_blank'
  options_json TEXT,            -- JSON con opciones
  correct_answer TEXT NOT NULL,
  points INTEGER DEFAULT 10
);
-- Resultados de quizzes
CREATE TABLE quiz_results (
  id INTEGER PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  quiz_id INTEGER REFERENCES quizzes(id),
  answer TEXT,
  is_correct BOOLEAN,
  answered_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- Badges/Insignias
CREATE TABLE badges (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  condition_type TEXT,          -- 'missions_completed', 'streak', 'perfect_quiz'
  condition_value INTEGER
);
-- Badges obtenidos por estudiante
CREATE TABLE student_badges (
  id INTEGER PRIMARY KEY,
  student_id INTEGER REFERENCES students(id),
  badge_id INTEGER REFERENCES badges(id),
  earned_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
🗺️ Mapa de Zonas del Mundo

🌍 MUNDO LEXIBLOX
│
├── 🌿 Zona 1: JUNGLA DE LOS COLORES    (Colors — nivel inicial)
├── 🔢 Zona 2: MONTAÑA DE NÚMEROS       (Numbers 1-20)
├── 🐾 Zona 3: SABANA ANIMAL            (Animals)
├── 🧥 Zona 4: CIUDAD DE LA ROPA        (Clothes & Body)
├── 🏠 Zona 5: PUEBLO FAMILIAR          (Family & Home)
├── 🍎 Zona 6: JARDÍN DE COMIDAS        (Food & Drinks)
├── ⏰ Zona 7: TORRE DEL TIEMPO         (Days, Months, Time)
└── 🚀 Zona 8: ESTACIÓN ESPACIAL        (Intermediate: Sentences)
Verification Plan
Manual Verification
Verificar que el portal estudiante carga el mapa y permite navegar zonas
Verificar que el portal docente muestra el dashboard con datos correctos
Verificar que los quizzes registran respuestas en SQLite correctamente
Verificar que los LexiCoins y XP se acumulan correctamente
Probar en navegadores Chrome y Firefox

# LexiBlox — Estado del Proyecto

Todos los archivos del árbol de directorios han sido completados con código funcional:
- **Core:** `app.js`, `db.js`, `state.js`, `auth.js`
- **Estudiante:** `worldmap.js`, `mission.js`, `quiz.js`, `rewards.js`, `characters.js`, `streak.js`
- **Docente:** `dashboard.js`, `students.js`, `groups.js`, `reports.js`, `missions-admin.js`
- **Páginas Docente:** `login.html`, `dashboard.html`, `students.html`, `groups.html`, `reports.html`, `missions.html`
- **Páginas Estudiante:** `login.html`, `world.html`, `mission.html`, `quiz.html`, `profile.html`
- **Contenido JSON:** `zones.json`, `missions.json`, `quizzes.json`, `vocabulary.json`