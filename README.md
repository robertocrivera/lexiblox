# 🌟 LexiBlox — Plataforma Educativa Gamificada de Inglés para Niños (6 a 8 Años)

> *"Construye tus palabras, construye tu mundo"*

**LexiBlox** es una plataforma web educativa interactiva y gamificada diseñada para que niños pequeños de 6 a 8 años aprendan inglés de nivel básico a intermedio jugando. En lugar de una aburrida aula virtual o iconos genéricos, los estudiantes exploran reinos en bloques 3D con personajes originales, completan misiones de vocabulario y enfrentan los retos del villano **Vox** para ganar **LexiCoins**, puntos de experiencia (**XP**) y medallas.

La plataforma cuenta con **dos portales independientes**:
- 🧒 **Portal Estudiante**: Aventura, mapa de reinos, flashcards interactivas con pronunciación por voz real y quizzes animados.
- 🧑‍🏫 **Portal Docente**: Dashboard analítico en tiempo real conectado a base de datos SQLite para supervisar el rendimiento de los niños y asignar misiones.

---

## 🎮 Personajes Originales (Toy Cubes)

| Personaje | Personalidad | Rol |
|---|---|---|
| 🟦 **Brixo** | Curioso, alegre y aventurero | Mascota guía que acompaña y anima al niño en cada lección |
| 🟥 **Lexo** | Sabio y paciente | Maestro constructor que enseña la estructura de las palabras |
| 🟨 **Zippy** | Rápido y enérgico | Especialista en misiones de velocidad y números |
| 🟪 **Vox** | Pillo y travieso | El villano que reta al jugador con quizzes interactivos |
| ⭐ **Stella** | Radiante y mágica | Otorga las recompensas, LexiCoins y subidas de nivel |

---

## 💡 Novedades y Factores Diferenciales del Proyecto

1. **Gamificación Genuina de Principio a Fin**: No es una plataforma con puntos añadidos por encima; la experiencia visual emula un videojuego de bloques (estilo LEGO/Minecraft infantil) con animaciones CSS fluidas.
2. **Pronunciación Nativa Integrada**: Utiliza la Web Speech API (`SpeechSynthesis`) en el navegador para reproducir la dicción exacta de cada palabra en inglés sin depender de archivos de audio externos.
3. **Persistencia Dual SQLite WASM**: Implementa base de datos relacional SQLite mediante WebAssembly (`sql.js`) con esquema relacional completo (docentes, alumnos, aulas, misiones, quizzes y registros de respuestas) y sincronización con LocalStorage.
4. **Dos Portales Integrados con Control de Acceso**:
   - Acceso para estudiantes con selección amigable de avatar y código PIN simplificado de 4 dígitos.
   - Acceso para docentes con credenciales protegidas y panel de métricas con detección de estudiantes que requieren refuerzo.

---

## 🛠️ Stack Tecnológico

- **Frontend Core**: HTML5 Semántico, CSS3 Moderno (Custom Properties, Flexbox, Grid, 3D Transforms, Keyframe Animations).
- **Lógica e Interacción**: JavaScript ES6+ Modular (Arquitectura limpia por capas: Core / Student / Teacher).
- **Base de Datos**: SQLite (Relacional, WASM `sql.js` + motor local de persistencia estructurado).
- **Audio & Pronunciación**: Web Speech API (`SpeechSynthesisUtterance` con acento `en-US`).
- **Diseño Gráfico**: CSS 3D Toy Cubes con animaciones de flotación y brillo.

---

## 🚀 Cómo Ejecutar el Proyecto

No requiere instalación de Node ni servidores pesados. Solo abre con cualquier navegador moderno:

1. Abre directamente el archivo `index.html` en tu navegador (o usa extensiones como *Live Server* en VSCode).
2. Selecciona entre **Portal Estudiante** o **Portal Docente**.

### 🔑 Cuentas de Demostración Preconfiguradas en SQLite:
- **Estudiantes**:
  - `sofia` (PIN: `1234`) — Nivel 3, 280 LexiCoins, 5 días de racha.
  - `carlos` (PIN: `1234`) — Nivel 2, 190 LexiCoins.
  - `mateo` (PIN: `1234`) — Nivel 4, 350 LexiCoins.
  - `vale` (PIN: `1234`) — Nivel 1 (estado de alerta sugerido en el panel docente).
- **Docente**:
  - Email: `prof.maria@escuela.com`
  - Contraseña: `profe123`

---

## 📁 Estructura del Código Fuente

```text
lexiblox/
├── index.html                        # Portada y selector de portales
├── README.md                         # Documentación del proyecto
│
├── assets/
│   ├── css/
│   │   ├── main.css                  # Tokens de color, resets y layout global
│   │   ├── animations.css            # Keyframes (float, star-spin, pulse-glow, wiggle)
│   │   ├── components.css            # Botones 3D, cubos Lego, HUD y tarjetas
│   │   ├── game.css                  # Estilos del mapa, flashcards y reto de Vox
│   │   └── teacher.css               # Estilos del dashboard del profesor
│   │
│   └── js/
│       ├── core/
│       │   ├── db.js                 # Motor SQLite / Relacional y semillas
│       │   ├── auth.js               # Autenticación de alumnos y profesores
│       │   └── state.js              # Manejo reactivo de sesión y recompensas
│       │
│       ├── student/
│       │   ├── worldmap.js           # Desbloqueo y render de los 8 mundos
│       │   ├── mission.js            # Flashcards 3D y pronunciación por voz
│       │   └── quiz.js               # Lógica del quiz de Vox y registro en SQLite
│       │
│       └── teacher/
│           └── dashboard.js          # KPIs, tabla de alumnos y asignación de tareas
│
└── pages/
    ├── student/
    │   ├── login.html                # Login infantil con avatar
    │   ├── world.html                # Mapa del mundo
    │   ├── mission.html              # Misión activa de vocabulario
    │   ├── quiz.html                 # Reto de preguntas
    │   └── profile.html              # Perfil, medallas e inventario
    │
    └── teacher/
        ├── login.html                # Login docente
        └── dashboard.html            # Panel de control de alumnos y misiones
```
