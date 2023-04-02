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
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "openQuizTab") {
    chrome.tabs.create({ url: chrome.runtime.getURL("quiz.html") });
  }
});
