export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { topic, tone, goal } = req.body;
  if (!topic || !tone || !goal) return res.status(400).json({ error: "Missing fields" });

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
    const post = data.content?.[0]?.text || "Error generating post";
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate post" });
  }
}
