import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST-verzoeken zijn toegestaan" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt ontbreekt" });
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "a80ac6c985e6d34c905b35925c379256e4033664eaa90511b3a2b6e5b3cfd312", // LLaMA 2 7B Chat
        input: {
          prompt: prompt,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Replicate fout:", data.error);
      return res.status(500).json({ error: data.error.message || "Fout bij AI-generatie" });
    }

    const output = data?.output?.join("") || data?.output;

    if (!output) {
      return res.status(500).json({ error: "Geen antwoord ontvangen" });
    }

    res.status(200).json({ result: output });
  } catch (error) {
    console.error("Fout bij replicatie-aanroep:", error);
    res.status(500).json({ error: "Er ging iets mis met de AI-aanroep" });
  }
}
