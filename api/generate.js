export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { prompt } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey)
    return res
      .status(500)
      .json({ error: "GROQ_API_KEY not set in Vercel env vars" });
  if (!prompt) return res.status(400).json({ error: "prompt is required" });

  const systemPrompt = `You are an expert frontend developer. Respond with ONLY a single complete self-contained HTML file. No markdown, no backticks. Start with <!DOCTYPE html>.`;

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 8000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "Build this web app: " + prompt },
        ],
      }),
    },
  );

  const data = await response.json();
  let html = data.choices?.[0]?.message?.content || "";
  const match =
    html.match(/<!DOCTYPE html[\s\S]*/i) || html.match(/<html[\s\S]*/i);
  if (match) html = match[0];

  res.status(200).json({ html });
}
