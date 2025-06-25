import Head from "next/head";
import styles from "../styles/globals.css";

export default function Home() {
  return (
    <>
      <Head>
        <title>Kaartensite</title>
      </Head>
      <main
        style={{
          height: "100vh",
          background: "linear-gradient(to right, #f0f0f0, #d4e0ff)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "3rem", color: "#333" }}>Welkom bij Kaartensite</h1>
        <p style={{ fontSize: "1.2rem", color: "#555" }}>
          Hier ontwerp je unieke kaarten met behulp van AI!
        </p>

        <button
          style={{
            marginTop: "2rem",
            padding: "1rem 2rem",
            fontSize: "1rem",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Start met ontwerpen
        </button>
      </main>
    </>
  );
}
