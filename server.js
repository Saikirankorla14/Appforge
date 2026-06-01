require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey === 'your_groq_api_key_here') {
    return res.status(500).json({ error: 'GROQ_API_KEY is not configured in .env' });
  }

  const systemPrompt = `You are an expert frontend developer. The user will describe a web app and you must respond with ONLY a single complete HTML file that implements it fully.

Rules:
- Output ONLY raw HTML. No markdown, no backticks, no explanation.
- The file must be fully self-contained: all CSS and JS inline, no external dependencies except CDN links.
- Use modern, clean design with a pleasant color scheme.
- Make it fully functional and interactive.
- Include error handling where appropriate.
- Use Google Fonts for nice typography (load via link tag).
- Start your response with <!DOCTYPE html> and nothing else before it.`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 8000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Build this web app: ' + prompt }
        ]
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: err.error?.message || 'Groq API error' });
    }

    const data = await response.json();
    let html = data.choices?.[0]?.message?.content || '';

    const match = html.match(/<!DOCTYPE html[\s\S]*/i) || html.match(/<html[\s\S]*/i);
    if (match) html = match[0];

    if (!html.trim()) {
      return res.status(500).json({ error: 'Empty response from model' });
    }

    res.json({ html });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 AppForge running at http://localhost:${PORT}`);
  console.log(`   API key loaded: ${process.env.GROQ_API_KEY ? '✅' : '❌ missing'}\n`);
});
