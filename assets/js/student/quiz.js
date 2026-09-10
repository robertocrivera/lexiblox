/**
 * LexiBlox — Student Quiz Interactive Logic
 */

let missionQuizzes = [];
let currentQuizIndex = 0;
let earnedCoins = 0;
let earnedXp = 0;
let correctCount = 0;

function initQuiz() {
  const urlParams = new URLSearchParams(window.location.search);
  const missionId = parseInt(urlParams.get('mission_id')) || 1;

  const student = LexiState.getStudent();
  if (student) {
    document.getElementById('hudCoins').textContent = student.lexi_coins || 0;
    document.getElementById('hudStreak').textContent = student.streak_days || 1;
  }

  // Load quizzes from SQLite
  missionQuizzes = LexiDB.query('SELECT * FROM quizzes WHERE mission_id = ?', [missionId]);
  
  if (missionQuizzes.length === 0) {
    // Fallback if none found
    missionQuizzes = LexiDB.query('SELECT * FROM quizzes LIMIT 4');
  }

  currentQuizIndex = 0;
  earnedCoins = 0;
  earnedXp = 0;
  correctCount = 0;

  document.getElementById('totalQNum').textContent = missionQuizzes.length;
  renderQuestion();
}

function renderQuestion() {
  const q = missionQuizzes[currentQuizIndex];
  document.getElementById('currentQNum').textContent = currentQuizIndex + 1;
  document.getElementById('quizQuestionText').textContent = q.question;

  const options = JSON.parse(q.options_json);
  const grid = document.getElementById('quizOptions');
  grid.innerHTML = '';

  options.forEach((optText, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn bounce-in';
    btn.textContent = optText;
    btn.onclick = () => checkAnswer(btn, index, q.correct_index, q.id);
    grid.appendChild(btn);
  });
}

function checkAnswer(selectedBtn, selectedIndex, correctIndex, quizId) {
  const allBtns = document.querySelectorAll('.quiz-opt-btn');
  allBtns.forEach(b => b.disabled = true);

  const student = LexiState.getStudent();
  const isCorrect = selectedIndex === correctIndex;

  // Log in SQLite
  if (student) {
    LexiDB.execute(
      'INSERT INTO quiz_logs (student_id, quiz_id, student_answer, is_correct) VALUES (?, ?, ?, ?)',
      [student.id, quizId, selectedIndex, isCorrect ? 1 : 0]
    );
  }

  if (isCorrect) {
    selectedBtn.classList.add('correct');
    document.getElementById('voxDialogue').textContent = '¡Grrr! ¡Has acertado! 😤 Brixo te aplaude.';
    earnedCoins += 15;
    earnedXp += 25;
    correctCount++;

    // Reward player immediately
    LexiState.rewardStudent(15, 25);
    const updated = LexiState.getStudent();
    if (updated) {
      document.getElementById('hudCoins').textContent = updated.lexi_coins;
    }
  } else {
    selectedBtn.classList.add('wrong');
    allBtns[correctIndex].classList.add('correct');
    document.getElementById('voxDialogue').textContent = '¡Ja, ja! ¡Esa era trampa! 😈 ¡Sigue practicando para la próxima!';
  }

  // Next question after short delay
  setTimeout(() => {
    currentQuizIndex++;
    if (currentQuizIndex < missionQuizzes.length) {
      renderQuestion();
    } else {
      finishQuiz();
    }
  }, 1400);
}

function finishQuiz() {
  document.getElementById('quizOptions').style.display = 'none';
  document.getElementById('quizQuestionText').style.display = 'none';
  document.querySelector('.quiz-question-box').style.display = 'none';

  const banner = document.getElementById('quizResultBanner');
  banner.style.display = 'block';

  document.getElementById('resultTitle').textContent = correctCount === missionQuizzes.length ? '¡PERFECTO! ¡VENCISTE A VOX! 👑' : '¡Bien Jugado, Explorador! 🌟';
  document.getElementById('resultSummary').textContent = `Acertaste ${correctCount} de ${missionQuizzes.length} preguntas. ¡Ganaste un total de +${earnedCoins} LexiCoins y +${earnedXp} XP!`;
}
