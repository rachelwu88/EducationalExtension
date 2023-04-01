chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'brieflySummarize',
    title: 'Summarize',
    contexts: ['selection']
  });

  chrome.contextMenus.create({
    id: 'brieflyMakeQuiz',
    title: 'Make Quiz',
    contexts: ['selection']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'brieflySummarize' || info.menuItemId === 'brieflyMakeQuiz') {
    chrome.tabs.sendMessage(tab.id, {
      action: info.menuItemId,
      selection: info.selectionText
    });
    console.log("Message sent to content script:", info.selectionText);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'summarizeText') {
    summarizeText(request.text).then(summary => {
      sendResponse(summary);
    });
    return true; // Required for async sendResponse
  } else if (request.action === 'makeQuiz') {
    makeQuiz(request.text).then(quiz => {
      sendResponse(quiz);
    });
    return true; // Required for async sendResponse
  }
});

async function summarizeText(text) {
  const response = await fetch('https://api.openai.com//v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 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'
    },
    body: JSON.stringify({
      prompt: `Summarize this text in one paragraph "${text}"`,
      model: 'text-davinci-002',
      max_tokens: 1500
    }),
  });

  const data = await response.json();
  const summary = data.choices[0].text.trim();
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
    })
  });

  const data = await response.json();
  const quiz = data.choices[0].text.trim();
  return quiz;
}
