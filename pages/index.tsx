import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setResult("");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.result) {
      setResult(data.result);
    } else {
      setResult("Er ging iets mis...");
    }

    setLoading(false);
  };

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Welkom bij Kaartensite</h1>
      <p>Hier komt jouw kaartdesign met AI ondersteuning.</p>

      <textarea
        rows={4}
        cols={50}
        placeholder="Typ hier je kaartwens of onderwerp..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ display: "block", marginTop: "1rem" }}
      />

      <button onClick={generate} disabled={loading} style={{ marginTop: "1rem" }}>
        {loading ? "Genereren..." : "Genereer kaarttekst"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem", background: "#eee", padding: "1rem" }}>
          <strong>Resultaat:</strong>
          <p>{result}</p>
        </div>
      )}
    </main>
  );
}
