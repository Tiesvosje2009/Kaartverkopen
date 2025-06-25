import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const prompt = req.body.prompt;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Jij bent een creatieve kaartenschrijver. Hou het luchtig en vriendelijk." },
        { role: "user", content: `Schrijf een kaarttekst voor: ${prompt}` },
      ],
      temperature: 0.8,
    }),
  });

  const data = await response.json();
  const message = data.choices?.[0]?.message?.content || "Kon geen kaart maken";

  res.status(200).json({ result: message });
}
