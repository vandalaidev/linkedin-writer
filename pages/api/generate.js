export default async function handler(req, res) {
  const { topic, tone, goal } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Write a LinkedIn post (3-8 sentences). Topic: ${topic}. Tone: ${tone}. Goal: ${goal}. Include 1-2 hashtags. Write ONLY the post, nothing else.`,
          },
        ],
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    const post = data.choices?.[0]?.message?.content || "Error generating post";
    res.status(200).json({ post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
