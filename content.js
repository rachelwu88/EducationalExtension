console.log('test');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'brieflySummarize') {
    summarizeText(request.selection).then(summary => {
      alert('Summary: ' + summary);
    });
  } else if (request.action === 'brieflyMakeQuiz') {
    makeQuiz(request.selection).then(quiz => {
      alert('Quiz: ' + JSON.stringify(quiz));
    });
  }
});

async function summarizeText(text) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
      prompt: `Summarize this text in one paragraph "${text}"`,
      model: 'text-davinci-003',
      max_tokens: 1500
      // n: 1,
      // stop: null,
      // temperature: 0.7
    }),
  });
  const data = await response.json();
  console.log(data)
  const summary = data.choices[0].text.trim();
  console.log(summary)
  return summary;
}



async function makeQuiz(text) {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
      prompt: `Generate 5 multiple-choice quiz questions with 4 choices each and indicate the correct answer about the following text: "${text}. Make sure you do it in the following format:
      Question text (space)
      A. Option A (space)
      B. Option B (space)
      C. Option C (space)
      D. Option D (space)
      Answer: X"`,
      model: 'text-davinci-003',
      max_tokens: 1500
      // max_tokens: 250,
      // n: 1,
      // stop: null,
      // temperature: 0.7
    })
  });
  const data = await response.json();
  const rawQuiz = data.choices[0].text.trim();
  console.log(rawQuiz)
  const quiz = parseQuiz(rawQuiz);
  displayQuiz(quiz);
}

function parseQuiz(rawQuiz) {
  const quiz = { questions: [], choices: [], answers: [] };
  const lines = rawQuiz.split('\n');
  // console.log(lines)

  for (let i = 0; i < lines.length; i += 7) {
    quiz.questions.push(lines[i]);
    quiz.choices.push([lines[i + 1], lines[i + 2], lines[i + 3], lines[i + 4]]);
    
    const answerLine = lines[i + 5];
    console.log(answerLine);
    const answerIndex = answerLine.split(' ')[1];
    const answerMap = { "A": 0, "B": 1, "C": 2, "D": 3 };
    quiz.answers.push(answerMap[answerIndex]);
  }

  return quiz;
}

function displayQuiz(quiz) {
  const quizWindow = window.open('', 'QuizWindow', 'width=800,height=600');
  quizWindow.document.write('<html><head><title>Quiz</title></head><body>');

  for (let i = 0; i < quiz.questions.length; i++) {
    quizWindow.document.write(`<p>${quiz.questions[i]}</p>`);

    for (let j = 0; j < 4; j++) {
      quizWindow.document.write(`<input type="radio" id="choice${i}${j}" name="question${i}" value="${j}">`);
      quizWindow.document.write(`<label for="choice${i}${j}">${quiz.choices[i][j]}</label><br>`);
    }
  }

  quizWindow.document.write('<button onclick="checkAnswers()">Submit</button>');
  quizWindow.document.write('<p id="result"></p>');
  quizWindow.document.write('</body></html>');

  quizWindow.checkAnswers = function() {
    let correctAnswers = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      const userAnswer = quizWindow.document.querySelector(`input[name="question${i}"]:checked`);
      if (userAnswer && userAnswer.value === quiz.answers[i]) {
        correctAnswers++;
      }
    }

    quizWindow.document.getElementById('result').innerHTML = `You got ${correctAnswers} out of ${quiz.questions.length} correct.`;
  };
}