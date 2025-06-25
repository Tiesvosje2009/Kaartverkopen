import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (err) {
      setResult("Er ging iets mis.");
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎨 Kaartgenerator</h1>
      <p>Typ hieronder waar de kaart over moet gaan:</p>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Bijv. verjaardag, beterschap, etc."
        style={{ width: "300px", padding: "0.5rem" }}
      />
      <button
        onClick={handleGenerate}
        style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
      >
        {loading ? "Bezig..." : "Genereer kaarttekst"}
      </button>
      {result && (
        <div style={{ marginTop: "2rem", background: "#f4f4f4", padding: "1rem" }}>
          <h2>✨ Jouw kaarttekst:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
