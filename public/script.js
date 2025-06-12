document.getElementById('shorten-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('url-input').value;
    const resultDiv = document.getElementById('result');

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
            resultDiv.innerHTML = `Short URL: <a href="${shortUrl}" target="_blank">${shortUrl}</a>`;
        } else {
            const error = await response.json();
            resultDiv.innerHTML = `Error: ${error.message}`;
        }
    } catch (error) {
        resultDiv.innerHTML = `Error: ${error.message}`;
    }
}); 