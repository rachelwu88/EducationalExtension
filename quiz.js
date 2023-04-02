window.addEventListener("message", (event) => {
    if (event.data.action === "loadQuiz") {
      loadQuiz(event.data.quiz);
    }
  });
  
  function loadQuiz(quiz) {
    const quizContainer = document.getElementById("quiz-container");
  
    for (let i = 0; i < quiz.questions.length; i++) {
      const questionElement = document.createElement("p");
      questionElement.textContent = quiz.questions[i];
      quizContainer.appendChild(questionElement);
  
      for (let j = 0; j < 4; j++) {
        const radioElement = document.createElement("input");
        radioElement.type = "radio";
        radioElement.id = `choice${i}${j}`;
        radioElement.name = `question${i}`;
        radioElement.value = j;
        quizContainer.appendChild(radioElement);
  
        const labelElement = document.createElement("label");
        labelElement.htmlFor = `choice${i}${j}`;
        labelElement.textContent = quiz.choices[i][j];
        quizContainer.appendChild(labelElement);
  
        quizContainer.appendChild(document.createElement("br"));
      }
    }
  }
  
  function checkAnswers() {
    const quiz = JSON.parse(document.getElementById("quiz-data").textContent);
    let correctAnswers = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      const userAnswer = document.querySelector(`input[name="question${i}"]:checked`);
      if (userAnswer && parseInt(userAnswer.value) === quiz.answers[i]) {
        correctAnswers++;
      }
    }
  
    document.getElementById("result").innerHTML = `You got ${correctAnswers} out of ${quiz.questions.length} correct.`;
  }
  