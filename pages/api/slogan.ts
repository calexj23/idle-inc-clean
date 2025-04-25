import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "Missing OpenAI API key on server." });
  }

  const { idea } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Generate a creative, witty startup slogan for: ${idea}`,
          },
        ],
        max_tokens: 40,
      }),
    });

    const data = await response.json();
    const slogan = data.choices?.[0]?.message?.content || "Couldn't generate slogan";

    res.status(200).json({ slogan });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "OpenAI request failed." });
  }
}
