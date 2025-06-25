import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check of er een body en prompt is
  if (!req.body || !req.body.prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  const prompt = req.body.prompt;

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
          { role: "system", content: "Jij bent een creatieve kaartenschrijver. Hou het luchtig en vriendelijk." },
          { role: "user", content: `Schrijf een kaarttekst voor: ${prompt}` },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      return res.status(response.status).json({ error: `OpenAI API error: ${errData}` });
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content || "Kon geen kaart maken";

    return res.status(200).json({ result: message });
  } catch (error) {
    return res.status(500).json({ error: "Server error: " + error.message });
  }
}
