import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Alleen POST-verzoeken zijn toegestaan." });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt ontbreekt." });
  }

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "a9f8f3d8b34c43d579c1fb3689e5a3c59dc7e4c4e82629c2c6fcb2ad3ec8a06b", // Mistral 7B instruct
        input: {
          prompt: prompt
        }
      })
    });

    const data = await response.json();

    if (response.status !== 201) {
      console.error("Fout bij Replicate-aanroep:", data);
      return res.status(500).json({ error: "Replicate gaf een foutmelding." });
    }

    res.status(200).json({ predictionId: data.id });
  } catch (error) {
    console
