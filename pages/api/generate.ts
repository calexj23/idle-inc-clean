import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).end();
  }

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You create fun random startup game content. Be playful but JSON structured.",
        },
        {
          role: "user",
          content: `Give me:
- 5 random creative startup product ideas (short and funny)
- 5 startup business events (good and bad)
- 3 team roles with unlock conditions.

Format clearly in JSON:
{
"productIdeas": [],
"events": [{"message": "", "delta": 0}],
"teamUnlocks": [{"name": "", "at": 0, "effect": ""}]
}`,
        },
      ],
    });

    const text = chatCompletion.choices[0].message?.content?.trim();
    const data = JSON.parse(text!);

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate game content" });
  }
}

