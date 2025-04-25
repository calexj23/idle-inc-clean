import React, { useState, useEffect } from "react";

const defaultSlogans = [
  "Disrupting mediocrity with chaotic brilliance.",
  "Where AI meets WTF.",
  "Powering the future with jokes and code.",
  "The smartest bad idea you'll ever fund.",
  "Serving nonsense. At scale.",
];

const productIdeas = [
  "AI for houseplants 🌿",
  "Smart fridge that roasts your outfit choices 🧥",
  "Crypto-based sandwich loyalty program 🥪",
  "Dog translator for Zoom meetings 🐶",
  "GPT-powered meditation yelling app 😤🧘‍♂️",
];

const upgradeFlavors = [
  "Pivot to enterprise clients 📊",
  "Launch quirky billboard campaign 🚀",
  "Hire a very loud intern 📣",
  "Add a blockchain just because 🔗",
  "Replace dev team with ChatGPT 🤖",
];

export default function Home() {
  const [revenue, setRevenue] = useState<number>(0);
  const [clickPower, setClickPower] = useState<number>(1);
  const [level, setLevel] = useState<number>(1);
  const [product, setProduct] = useState<string>(productIdeas[0]);
  const [slogan, setSlogan] = useState<string>("");
  const [theme, setTheme] = useState<string>("default");
  const [startupsFounded, setStartupsFounded] = useState<number>(1);
  const [bestSlogan, setBestSlogan] = useState<string>("");
  const [themeUnlocked, setThemeUnlocked] = useState<boolean>(false);

  const generateSlogan = async () => {
    try {
      const response = await fetch("/api/slogan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: product }),
      });
      const data = await response.json();
      const aiSlogan = data.slogan;
      setSlogan(aiSlogan);
      if (aiSlogan.length > bestSlogan.length) setBestSlogan(aiSlogan);
    } catch (err) {
      console.error("Proxy error:", err);
      setSlogan("AI is on vacation 😅");
    }
  };

  const handleWork = () => {
    setRevenue(prev => prev + clickPower);
  };

  const handleUpgrade = () => {
    const cost = 50 * level;
    if (revenue >= cost) {
      setRevenue(revenue - cost);
      setClickPower(clickPower + 1);
      setLevel(level + 1);
      if (revenue >= 500 && !themeUnlocked) {
        setTheme("gold");
        setThemeUnlocked(true);
      }
    }
  };

  const startNewStartup = () => {
    setRevenue(0);
    setClickPower(1);
    setLevel(1);
    setStartupsFounded((prev) => prev + 1);
    const nextIdea = productIdeas[Math.floor(Math.random() * productIdeas.length)];
    setProduct(nextIdea);
    setSlogan("");
  };

  const styleMap: Record<string, React.CSSProperties> = {
    default: { backgroundColor: "#1DA1F2", color: "#fff" },
    gold: { backgroundColor: "gold", color: "#000" },
  };

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 600, margin: "auto" }}>
      <h1>🦄 Idle Inc: Startup Tycoon</h1>

      <h2>Your Startup: {product}</h2>
      <p><strong>Slogan:</strong> {slogan || "No slogan yet"}</p>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleWork} style={{ padding: "0.5rem 1rem" }}>💼 Work (+${clickPower})</button>
        <button onClick={handleUpgrade} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          🧪 Upgrade (-${50 * level})
        </button>
        <button onClick={generateSlogan} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>✨ AI Slogan</button>
        <button onClick={startNewStartup} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>🔁 Restart</button>
      </div>

      <h3>📊 Your Founder Stats</h3>
      <ul>
        <li>Total Revenue: ${revenue}</li>
        <li>Click Power: {clickPower}</li>
        <li>Startups Founded: {startupsFounded}</li>
        <li>Best Slogan: "{bestSlogan || "N/A"}"</li>
        <li>Current Theme: {themeUnlocked ? theme : "Locked"}</li>
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=I built a startup called ${product} and earned $${revenue}! Slogan: ${slogan}`}
          target="_blank"
          rel="noopener noreferrer"
          style={styleMap[theme]}
        >
          🔗 Share on Twitter
        </a>
      </div>
    </main>
  );
}