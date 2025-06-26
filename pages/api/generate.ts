import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST-verzoeken zijn toegestaan" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt ontbreekt" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Je bent een creatieve kaartenmaker. Schrijf een korte, originele tekst voor dit onderwerp:" },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("OpenAI fout:", data);
      return res.status(500).json({ error: "Geen geldig antwoord van OpenAI" });
    }

    res.status(200).json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error("Fout tijdens AI-aanroep:", error);
    res.status(500).json({ error: "Er ging iets mis met OpenAI" });
  }
}
