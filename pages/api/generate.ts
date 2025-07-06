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
        version: "7d1d6a54e8b84dbfa7efba0c331b46081e0526e64c5d61760a6b48c4c6e5c4b8", // Stable Diffusion text-to-image model
        input: {
          prompt: prompt,
          width: 512,
          height: 512,
          num_outputs: 1,
          scheduler: "dpmsolver++",
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error("Replicate fout:", data.error);
      return res.status(500).json({ error: data.error.message || "Fout bij AI-generatie" });
    }

    const output = data?.prediction?.output || data?.output;

    if (!output || output.length === 0) {
      return res.status(500).json({ error: "Geen afbeelding gegenereerd" });
    }

    res.status(200).json({ result: output[0] });
  } catch (error) {
    console.error("Fout bij replicatie-aanroep:", error);
    res.status
