export default async function handler(req, res) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    return res.status(400).json({ error: "API key is missing" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 100,
        messages: [{ role: "user", content: "Say hello" }],
      }),
    });

    const data = await response.json();
    return res.status(200).json({ status: response.status, data });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
