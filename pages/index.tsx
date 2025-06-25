import Head from "next/head";
import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleGenerate = () => {
    // Voor nu is dit nep, straks koppelen we dit aan OpenAI
    setResponse(`🎉 Jouw kaartidee: "${input}" 🎉`);
  };

  return (
    <>
      <Head>
        <title>Kaartensite</title>
      </Head>
      <main
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to right, #f0f0f0, #d4e0ff)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", color: "#333" }}>Welkom bij Kaartensite</h1>
        <p style={{ fontSize: "1.2rem", color: "#555", marginBottom: "2rem" }}>
          Typ hieronder je kaartwens en genereer een uniek ontwerp!
        </p>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Bijv. 'Verjaardagskaart voor oma'"
          style={{
            padding: "1rem",
            width: "300px",
            fontSize: "1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginBottom: "1rem",
          }}
        />

        <button
          onClick={handleGenerate}
          style={{
            padding: "1rem 2rem",
            fontSize: "1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Genereer kaart
        </button>

        {response && (
          <div style={{ marginTop: "2rem", color: "#0070f3", fontSize: "1.2rem" }}>
            {response}
          </div>
        )}
      </main>
    </>
  );
}

