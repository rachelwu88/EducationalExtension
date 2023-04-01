chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'summarize') {
      summarizeText(request.selection).then(summary => {
        alert('Summary: ' + summary);
      });
    } else if (request.action === 'makeQuiz') {
      makeQuiz(request.selection).then(quiz => {
        alert('Quiz: ' + JSON.stringify(quiz));
      });
    }
  });
  
  async function summarizeText(text) {
    const response = await fetch('https://api.openai.com/v1/engines/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      },
      body: JSON.stringify({
        prompt: `Summarize the following text: "${text}"`,
        max_tokens: 50,
        n: 1,
        stop: null,
        temperature: 0.7
      })
    });
  
    const data = await response.json();
    const summary = data.choices[0].text.trim();
    return summary;
  }
  
  
  
  async function makeQuiz(text) {
    // Call ChatGPT API for generating quiz
    // Return the quiz
  }
  