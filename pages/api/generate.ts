import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Alleen POST-verzoeken zijn toegestaan' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt ontbreekt' });
  }

  try {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
      },
      body: JSON.stringify({
        version: 'a7d8a4b8ef8d4ad6a22c2b8899f7fe94b1a9e08e409b0c27f01af3d6107c71e1',
        input: {
          prompt: `Schrijf een korte en originele kaarttekst over: ${prompt}`,
          temperature: 0.7,
          max_new_tokens: 100
        }
      }),
    });

    const data = await response.json();

    if (data?.error) {
      console.error('Replicate fout:', data);
      return res.status(500).json({ error: 'AI-service gaf een foutmelding' });
    }

    // Replicate werkt met async prediction, dus we moeten wachten op resultaat:
    const predictionUrl = data.urls.get;
    let resultData = null;

    for (let i = 0; i < 10; i++) {
      const resultRes = await fetch(predictionUrl, {
        headers: {
          Authorization: `Token ${process.env.REPLICATE_API_KEY}`,
        },
      });
      resultData = await resultRes.json();

      if (resultData.status === 'succeeded') break;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    if (resultData?.output) {
      res.status(200).json({ result: resultData.output.join('\n') });
    } else {
      res.status(500).json({ error: 'AI-resultaat niet ontvangen' });
    }

  } catch (err) {
    console.error('Fout:', err);
    res.status(500).json({ error: 'Er ging iets mis tijdens de AI-aanroep' });
  }
}
