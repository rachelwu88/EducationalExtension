console.log("Content script loaded");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received:", request);
  if (request.action === 'brieflySummarize') {
    chrome.runtime.sendMessage({ action: 'summarizeText', text: request.selection }, summary => {
      alert('Summary: ' + summary);
    });
  } else if (request.action === 'brieflyMakeQuiz') {
    chrome.runtime.sendMessage({ action: 'makeQuiz', text: request.selection }, quiz => {
      console.log(quiz);
      alert('Quiz: ' + JSON.stringify(quiz));
    });
  }
});

