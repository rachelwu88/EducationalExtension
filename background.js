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
  