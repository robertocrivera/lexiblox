/**
 * LexiBlox — Characters Logic & Visual Dialogue Controller
 * Manages Brixo, Lexo, Zippy, Vox and Stella
 */

const LexiCharacters = {
  CHARACTERS: {
    brixo: {
      name: 'Brixo',
      role: 'Guía y Compañero',
      color: '#3b82f6',
      icon: '🟦',
      quotes: [
        '¡Sigue así, explorador de bloques!',
        '¡Cada palabra en inglés te hace más fuerte!',
        '¡Mira cuántas LexiCoins estás acumulando!'
      ]
    },
    lexo: {
      name: 'Lexo',
      role: 'Maestro Constructor',
      color: '#ef4444',
      icon: '🟥',
      quotes: [
        'Las palabras son bloques: colócalas bien para armar oraciones.',
        'Escucha con atención cómo suena cada letra.'
      ]
    },
    zippy: {
      name: 'Zippy',
      role: 'El Relámpago',
      color: '#f59e0b',
      icon: '🟨',
      quotes: [
        '¡Rápido como el viento! ¡A contar números!',
        '¡No pares, la meta está muy cerca!'
      ]
    },
    vox: {
      name: 'Vox',
      role: 'Retador de Quizzes',
      color: '#8b5cf6',
      icon: '🟪',
      quotes: [
        '¡A ver si puedes descifrar mi siguiente trampa! 😈',
        '¡No creo que recuerdes cómo se dice esto!',
        '¡Ja! ¿Serás capaz de ganarme hoy?'
      ]
    },
    stella: {
      name: 'Stella',
      role: 'Estrella de Recompensas',
      color: '#fbbf24',
      icon: '⭐',
      quotes: [
        '¡Brillas como una estrella del conocimiento!',
        '¡Aquí tienes tu cofre de recompensas!'
      ]
    }
  },

  getRandomQuote(charKey) {
    const char = this.CHARACTERS[charKey] || this.CHARACTERS.brixo;
    const index = Math.floor(Math.random() * char.quotes.length);
    return { name: char.name, quote: char.quotes[index] };
  },

  setDialogue(charKey, customMessage) {
    const speakerEl = document.querySelector('.dialogue-speaker');
    const textEl = document.querySelector('.dialogue-text') || document.getElementById('mascotText');

    const char = this.CHARACTERS[charKey] || this.CHARACTERS.brixo;

    if (speakerEl) speakerEl.textContent = `${char.name} dice:`;
    if (textEl) textEl.textContent = customMessage || this.getRandomQuote(charKey).quote;
  }
};

window.LexiCharacters = LexiCharacters;
