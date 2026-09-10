/**
 * LexiBlox — Mission & Flashcard Interactive Logic
 */

let currentWords = [];
let currentIndex = 0;
let currentZoneId = 1;
let currentMissionId = 1;

const VOCAB_DATABASE = {
  colors: [
    { en: 'RED', es: 'ROJO', icon: '🔴', sample: 'The red brick builds strong walls' },
    { en: 'BLUE', es: 'AZUL', icon: '🔵', sample: 'The blue sky covers the world' },
    { en: 'YELLOW', es: 'AMARILLO', icon: '🟡', sample: 'The yellow sun shines bright' },
    { en: 'GREEN', es: 'VERDE', icon: '🟢', sample: 'The green tree has fresh leaves' }
  ],
  numbers: [
    { en: 'ONE', es: 'UNO', icon: '1️⃣', sample: 'One friendly cube says hello' },
    { en: 'TWO', es: 'DOS', icon: '2️⃣', sample: 'Two eyes looking at you' },
    { en: 'THREE', es: 'TRES', icon: '3️⃣', sample: 'Three little blocks make a tower' },
    { en: 'FOUR', es: 'CUATRO', icon: '4️⃣', sample: 'Four corners make a cube' },
    { en: 'FIVE', es: 'CINCO', icon: '5️⃣', sample: 'High five for your great effort!' }
  ]
};

function initMission() {
  const urlParams = new URLSearchParams(window.location.search);
  currentZoneId = parseInt(urlParams.get('zone_id')) || 1;

  const student = LexiState.getStudent();
  if (student) {
    document.getElementById('hudCoins').textContent = student.lexi_coins || 0;
    document.getElementById('hudLevel').textContent = student.level || 1;
  }

  // Load words based on zone
  if (currentZoneId === 2) {
    currentWords = VOCAB_DATABASE.numbers;
    currentMissionId = 5;
    document.getElementById('missionZoneLabel').textContent = 'ZONA 2 · NUMBER MOUNTAIN';
    document.getElementById('missionTitle').textContent = 'Counting 1 to 5 with Zippy';
  } else {
    currentWords = VOCAB_DATABASE.colors;
    currentMissionId = 1;
    document.getElementById('missionZoneLabel').textContent = 'ZONA 1 · COLOR JUNGLE';
    document.getElementById('missionTitle').textContent = 'Primary Colors with Brixo';
  }

  currentIndex = 0;
  document.getElementById('cardTotalNum').textContent = currentWords.length;
  renderCard();
}

function renderCard() {
  const item = currentWords[currentIndex];
  document.getElementById('cardIndexNum').textContent = currentIndex + 1;
  document.getElementById('cardIcon').textContent = item.icon;
  document.getElementById('cardIconBack').textContent = item.icon;
  document.getElementById('cardWordEn').textContent = item.en;
  document.getElementById('cardWordEs').textContent = item.es;
  document.getElementById('cardSampleSentence').textContent = `"${item.sample}"`;

  // Reset flip
  document.getElementById('flashcardInner').classList.remove('flipped');

  // Disable/Enable buttons
  document.getElementById('btnPrev').disabled = currentIndex === 0;

  // Show quiz prompt on last card
  if (currentIndex === currentWords.length - 1) {
    document.getElementById('quizPromptBox').style.display = 'block';
  }
}

function flipCard() {
  const card = document.getElementById('flashcardInner');
  card.classList.toggle('flipped');
}

function prevCard() {
  if (currentIndex > 0) {
    currentIndex--;
    renderCard();
  }
}

function nextCard() {
  if (currentIndex < currentWords.length - 1) {
    currentIndex++;
    renderCard();
  } else {
    document.getElementById('quizPromptBox').scrollIntoView({ behavior: 'smooth' });
  }
}

/**
 * Speech Synthesis (Native browser text-to-speech for English)
 */
function speakWord(event) {
  if (event) event.stopPropagation();
  const word = currentWords[currentIndex].en;
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
    utterance.lang = 'en-US';
    utterance.rate = 0.85; // slightly slower for 6-8 year olds
    window.speechSynthesis.speak(utterance);
  }
}

function goToQuiz() {
  window.location.href = `quiz.html?mission_id=${currentMissionId}`;
}
