async function checkGrammar() {
    const text = document.getElementById('grammarInput').value;
    const resultDiv = document.getElementById('grammarResult');
    if (!text) {
        resultDiv.innerHTML = '<p>Please enter text to check.</p>';
        return;
    }
    resultDiv.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>Checking...</p></div>';

    try {
        const response = await fetch('https://api.languagetool.org/v2/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `text=${encodeURIComponent(text)}&language=auto`
        });
        const data = await response.json();

        let correctedText = text;
        let correctionsHTML = '';
        if (data.matches.length > 0) {
            let lastIndex = 0;
            let highlightedText = '';
            data.matches.forEach(match => {
                highlightedText += text.substring(lastIndex, match.offset);
                highlightedText += `<span style="background-color: rgba(255, 165, 0, 0.3);" title="${match.message}">${text.substring(match.offset, match.offset + match.length)}</span>`;
                lastIndex = match.offset + match.length;
            });
            highlightedText += text.substring(lastIndex);

            resultDiv.innerHTML = `<div><h3>Corrected Text:</h3><p style="white-space: pre-wrap;">${highlightedText}</p></div>`;
        } else {
            resultDiv.innerHTML = '<h3>No grammar errors found!</h3>';
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error-message">Error checking grammar: ${error.message}</p>`;
    }
}
