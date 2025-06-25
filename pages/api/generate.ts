import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST-verzoeken zijn toegestaan" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt ontbreekt in het verzoek" });
  }

  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Je bent een vrolijke kaartenmaker. Schrijf een originele kaarttekst voor het volgende onderwerp.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    const data = await openaiRes.json();

    // Debug-logging bij fout
    if (!data.choices || !data.choices[0]) {
      console.error("OpenAI antwoord:", data);
      return res.status(500).json({ error: "Geen geldig antwoord van OpenAI" });
    }

    const aiMessage = data.choices[0].message.content;

    res.status(200).json({ result: aiMessage });
  } catch (error) {
    console.error("Fout bij OpenAI-aanroep:", error);
    res.status(500).json({ error: "Interne serverfout bij AI-aanroep" });
  }
}
