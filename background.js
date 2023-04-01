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
    setTimeout(() => { // add a delay
      chrome.tabs.sendMessage(tab.id, {
        action: info.menuItemId,
        selection: info.selectionText
      });
      console.log("Message sent to content script:", info.selectionText);
    }, 1000); // add a delay of 1 second (1000 ms)
  }
});

let currentQuiz = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openQuizPopup') {
    currentQuiz = request.quiz;
    openQuizPopup();
  }
});

function openQuizPopup() {
  chrome.windows.create({
    url: chrome.runtime.getURL('quiz_popup.html'),
    type: 'popup',
    width: 320,
    height: 200,
  });
}

chrome.runtime.onConnect.addListener(port => {
  if (port.name === 'quizPopup' && currentQuiz) {
    port.postMessage({
      action: 'displayQuiz',
      quiz: currentQuiz,
    });
    currentQuiz = null;
  }
});
