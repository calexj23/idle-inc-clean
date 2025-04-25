import React, { useState } from "react";

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

const events = [
  { message: "🔥 Your pitch went viral!", delta: 100 },
  { message: "😬 Server costs spiked!", delta: -40 },
  { message: "🎉 Angel investor bonus!", delta: 200 },
  { message: "💸 Paid influencer scandal!", delta: -60 },
  { message: "🚀 Feature got Product Hunt love!", delta: 150 },
];

export default function Home() {
  const [startupName, setStartupName] = useState("My Startup");
  const [revenue, setRevenue] = useState(0);
  const [clickPower, setClickPower] = useState(1);
  const [level, setLevel] = useState(1);
  const [product, setProduct] = useState(productIdeas[0]);
  const [slogan, setSlogan] = useState("");
  const [theme, setTheme] = useState("default");
  const [startupsFounded, setStartupsFounded] = useState(1);
  const [bestSlogan, setBestSlogan] = useState("");
  const [themeUnlocked, setThemeUnlocked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [eventPopup, setEventPopup] = useState<string | null>(null);

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

  const triggerRandomEvent = () => {
    const event = events[Math.floor(Math.random() * events.length)];
    setEventPopup(`${event.message} ${event.delta > 0 ? "+$" : "-$"}${Math.abs(event.delta)}`);
    setRevenue(prev => Math.max(prev + event.delta, 0));
    setTimeout(() => setEventPopup(null), 3000);
  };

  const handleWork = () => {
    setRevenue(prev => prev + clickPower);
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount % 10 === 0) triggerRandomEvent();
      return newCount;
    });
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
    setStartupsFounded(prev => prev + 1);
    setClickCount(0);
    const nextIdea = productIdeas[Math.floor(Math.random() * productIdeas.length)];
    setProduct(nextIdea);
    setSlogan("");
  };

  const styleMap: Record<string, React.CSSProperties> = {
    default: { backgroundColor: "#1DA1F2", color: "#fff" },
    gold: { backgroundColor: "gold", color: "#000" },
  };

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 600, margin: "auto", position: "relative" }}>
      <h1>🦄 Idle Inc: Startup Tycoon</h1>

      <input
        type="text"
        placeholder="Enter your startup name"
        value={startupName}
        onChange={(e) => setStartupName(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      <h2>Your Startup: {startupName}</h2>
      <p><strong>Idea:</strong> {product}</p>
      <p><strong>Slogan:</strong> {slogan || "No slogan yet"}</p>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={handleWork} style={{ padding: "0.5rem 1rem" }}>💼 Work (+${clickPower})</button>
        <button onClick={handleUpgrade} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>
          🧪 Upgrade (-${50 * level})
        </button>
        <button onClick={generateSlogan} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>✨ AI Slogan</button>
        <button onClick={startNewStartup} style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}>🔁 Restart</button>
      </div>

      {eventPopup && (
        <div style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          color: "#333",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          fontWeight: "bold",
        }}>{eventPopup}</div>
      )}

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
          href={`https://twitter.com/intent/tweet?text=I built ${startupName} and earned $${revenue}! Slogan: ${slogan}`}
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
