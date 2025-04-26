import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { idea } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a startup brand expert." },
        { role: "user", content: `Write a short, catchy startup slogan for this idea: ${idea}` },
      ],
    });

    const slogan = chatCompletion.choices[0].message?.content?.trim();
    res.status(200).json({ slogan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate slogan" });
  }
}
