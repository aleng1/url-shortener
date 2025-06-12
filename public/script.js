document.getElementById('shorten-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url-input').value;
    const resultDiv = document.getElementById('result');
    const loader = document.getElementById('loader');

    // Reset previous results and show loader
    resultDiv.innerHTML = '';
    loader.style.display = 'block';

    try {
        const response = await fetch('/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (response.ok) {
            const data = await response.json();
            const shortUrl = `${window.location.origin}/${data.shortCode}`;
            
            resultDiv.innerHTML = `
                <div class="result-container">
                    <p>Short URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a></p>
                    <button class="copy-btn" onclick="copyToClipboard('${shortUrl}')">Copy</button>
                </div>
            `;
        } else {
            const error = await response.json();
            resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        }
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
    } finally {
        // Hide loader
        loader.style.display = 'none';
    }
});

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const copyButton = document.querySelector('.copy-btn');
        if (copyButton) {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = 'Copy';
            }, 2000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
} 