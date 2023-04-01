const questionElement = document.getElementById('question');
const userAnswerElement = document.getElementById('user-answer');
const submitAnswerButton = document.getElementById('submit-answer');
const resultElement = document.getElementById('result');

const port = chrome.runtime.connect({ name: 'quizPopup' });

port.onMessage.addListener(request => {
  if (request.action === 'displayQuiz') {
    const { question, answer } = request.quiz;
    questionElement.innerText = question;

    submitAnswerButton.onclick = () => {
      const userAnswer = userAnswerElement.value.trim().toLowerCase();
      const correctAnswer = answer.trim().toLowerCase();

      if (userAnswer === correctAnswer) {
        resultElement.textContent = 'Correct!';
        resultElement.style.color = 'green';
      } else {
        resultElement.textContent = `Incorrect. The correct answer is: ${answer}`;
        resultElement.style.color = 'red';
      }
    };
  }
});


