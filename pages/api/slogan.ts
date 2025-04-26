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

  const { startupName } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `Create a catchy, fun, and professional startup slogan for a company called "${startupName}"`,
        },
      ],
      max_tokens: 50,
    });

    const aiMessage = completion.choices[0]?.message?.content || "";

    res.status(200).json({ slogan: aiMessage });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
