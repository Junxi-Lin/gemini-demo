const btn = document.getElementById('submit');
const out = document.getElementById('geminiResponse');

btn.addEventListener('click', async () => {
  const userQuery = document.getElementById('userInput').value.trim();
  if (!userQuery) return alert('Please enter a query.');

  out.textContent = 'Loading...';

  try {
    const resp = await fetch('/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userQuery })
    });

    const ct = resp.headers.get('content-type') || '';
    const body = ct.includes('application/json') ? await resp.json() : { error: await resp.text() };

    if (!resp.ok) {
      out.textContent = `Error ${resp.status}: ${body.error || JSON.stringify(body)}`;
      return;
    }

    out.textContent = body.text || '(empty response)';
  } catch (e) {
    out.textContent = 'Network error: ' + e.message;
  }
});