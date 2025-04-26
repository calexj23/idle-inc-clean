import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { userIdea } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Turn this startup idea into a polished event or milestone for a startup simulation game: ${userIdea}`,
        },
      ],
      max_tokens: 100,
    });

    const aiMessage = completion.choices[0]?.message?.content || "";

    res.status(200).json({ message: aiMessage });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
