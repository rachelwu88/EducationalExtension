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
      // Inject the content script into the current tab
      chrome.tabs.executeScript(tab.id, { file: 'content.js' }, () => {
        // Send a message to the content script after it's injected
        chrome.tabs.sendMessage(tab.id, {
          action: info.menuItemId,
          selection: info.selectionText
        });
        console.log("Message sent to content script:", info.selectionText);
      });
    }
  });
  