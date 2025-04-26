import type { NextApiRequest, NextApiResponse } from "next";
import openai from "openai";

openai.apiKey = process.env.OPENAI_API_KEY!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { startupName } = req.body;

  try {
    const completion = await openai.Completion.create({
      engine: "davinci",
      prompt: `Create a catchy, fun, and professional startup slogan for a company called "${startupName}"`,
      max_tokens: 50,
    });

    const aiMessage = completion.choices?.[0]?.text?.trim() || "";

    res.status(200).json({ slogan: aiMessage });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
}
