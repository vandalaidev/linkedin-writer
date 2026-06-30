export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { topic, tone, goal } = req.body;
  if (!topic || !tone || !goal) return res.status(400).json({ error: "Missing fields" });

  console.log("API Key exists:", !!process.env.ANTHROPIC_API_KEY);
  console.log("Topic:", topic);

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 500,
        messages: [
          {
            role: "user",
            content: `Write a LinkedIn post (3-8 sentences). Topic: ${topic}. Tone: ${tone}. Goal: ${goal}. Include 1-2 hashtags. Write ONLY the post, nothing else.`,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", data);

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const post = data.content?.[0]?.text || "No content returned";
    res.status(200).json({ post });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
}
