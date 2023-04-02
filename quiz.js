let quiz= {}

function displayQuiz() {
    chrome.storage.local.get("quizData", (data) => {
        quiz = JSON.parse(data.quizData);
    
    if (!quiz) {
        console.error("Quiz data not found in chrome.storage.local");
        return;
    }

  const quizContainer = document.getElementById('quiz-container');

  for (let i = 0; i < quiz.questions.length; i++) {
    const questionElement = document.createElement('p');
    questionElement.textContent = quiz.questions[i];
    questionElement.classList.add('question'); 
    quizContainer.appendChild(questionElement);

    for (let j = 0; j < 4; j++) {
      const choiceElement = document.createElement('input');
      choiceElement.type = 'radio';
      choiceElement.id = `choice${i}${j}`;
      choiceElement.name = `question${i}`;
      choiceElement.value = j;
      choiceElement.classList.add('choice'); 
      quizContainer.appendChild(choiceElement);

      const labelElement = document.createElement('label');
      labelElement.htmlFor = `choice${i}${j}`; 
      labelElement.textContent = quiz.choices[i][j];
      labelElement.classList.add('choice');
      quizContainer.appendChild(labelElement);
      quizContainer.appendChild(document.createElement('br'));
    }
  }
  const submitButton = document.getElementById('submit');
  submitButton.addEventListener('click', checkAnswers);
})
}

function checkAnswers() {
  let correctAnswers = 0;
  for (let i = 0; i < quiz.questions.length; i++) {
    const userAnswer = (document.querySelector(`input[name="question${i}"]:checked`));
    if (parseInt(userAnswer.value) == quiz.answers[i]) {
      const labelElement = document.querySelector(`label[for="choice${i}${userAnswer.value}"]`);
      labelElement.style.color = 'green';
      correctAnswers++;
    }
  }

  document.getElementById('result').innerHTML = `You got ${correctAnswers} out of ${quiz.questions.length} correct.`;
}

displayQuiz();
localStorage.clear();
