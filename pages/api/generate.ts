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
    // Start voorspelling
    const predictionRes = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
      },
      body: JSON.stringify({
        version: "a80ac6c985e6d34c905b35925c379256e4033664eaa90511b3a2b6e5b3cfd312", // LLaMA 2 7B Chat
        input: {
          prompt,
        },
      }),
    });

    let prediction = await predictionRes.json();

    if (prediction.error) {
      console.error("Replicate fout:", prediction.error);
      return res.status(500).json({ error: prediction.error.message });
    }

    // Poll totdat klaar
    while (
      prediction.status !== "succeeded" &&
      prediction.status !== "failed" &&
      prediction.status !== "canceled"
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wacht 1s

      const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      prediction = await pollRes.json();
    }

    if (prediction.status !== "succeeded") {
      return res.status(500).json({ error: "AI-aanvraag is mislukt" });
    }

    res.status(200).json({ result: prediction.output });
  } catch (error) {
    console.error("Fout bij replicatie-aanroep:", error);
    res.status(500).json({ error: "Er ging iets mis met de AI-aanroep" });
  }
}

