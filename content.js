console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.action === 'brieflySummarize') {
    summarizeText(request.selection).then(summary => {
      console.log(summary)
      alert('Summary: ' + summary);
    });
  } else if (request.action === 'brieflyMakeQuiz') {
    makeQuiz(request.selection).then(quiz => {
      console.log(quiz);
      // Parse the question and answer from the quiz text.
      const [question, answer] = quiz.split('\n');
      chrome.runtime.sendMessage({
        action: 'openQuizPopup',
        quiz: { question, answer },
      });
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
      model: 'text-davinci-002',
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
      prompt: `Create a quiz question and answer based on the following text: "${text}"`,
      model: 'text-davinci-002'
      // max_tokens: 300,
      // n: 1,
      // stop: null,
      // temperature: 0.7
    })
  });

  function openQuizPopup() {
    chrome.windows.create({
      url: 'quiz_popup.html',
      type: 'popup',
      width: 320,
      height: 200,
    });
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'displayQuiz') {
      openQuizPopup();
    }
  });

  const data = await response.json();
  const quiz = data.choices[0].text.trim();
  return quiz;
}
  