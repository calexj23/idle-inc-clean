import React, { useState, useEffect } from "react";

const productIdeas = [
  "AI for houseplants 🌿",
  "Smart fridge that roasts your outfit choices 🧥",
  "Crypto-based sandwich loyalty program 🥪",
  "Dog translator for Zoom meetings 🐶",
  "GPT-powered meditation yelling app 😤🧘‍♂️",
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
  const [unlockedTeam, setUnlockedTeam] = useState<string[]>([]);
  const [events, setEvents] = useState([
    { message: "🛠️ Infrastructure upgrade! +$80", delta: 80 },
    { message: "📈 You closed a Series A round! +$500", delta: 500 },
    { message: "🎯 Viral blog post by your intern! +$120", delta: 120 },
    { message: "📉 Legal fees set you back. -$100", delta: -100 },
    { message: "🧪 Testing chaos — rollback deployed. -$50", delta: -50 },
  ]);

  const teamUnlocks = [
    { name: "Dev Intern", at: 200, effect: "+1 click power" },
    { name: "Marketing Guru", at: 500, effect: "AI slogans get boost" },
    { name: "CFO", at: 1000, effect: "Idle income every 10s" },
  ];

  useEffect(() => {
    const eligible = teamUnlocks.filter(
      (t) => revenue >= t.at && !unlockedTeam.includes(t.name)
    );
    if (eligible.length > 0) {
      setUnlockedTeam((prev) => [...prev, ...eligible.map((e) => e.name)]);
    }
  }, [revenue]);

  const nextMilestone = teamUnlocks.find(
    (t) => !unlockedTeam.includes(t.name)
  );

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
    setEventPopup(event.message);
    setRevenue((prev) => Math.max(prev + event.delta, 0));
    setTimeout(() => setEventPopup(null), 3000);
  };

  const handleWork = () => {
    setRevenue((prev) => prev + clickPower);
    setClickCount((prev) => {
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
    setStartupsFounded((prev) => prev + 1);
    setClickCount(0);
    setUnlockedTeam([]);
    const nextIdea =
      productIdeas[Math.floor(Math.random() * productIdeas.length)];
    setProduct(nextIdea);
    setSlogan("");
    // ❗ Don't reset startupName, so user's name stays
  };

  const styleMap: Record<string, React.CSSProperties> = {
    default: { backgroundColor: "#1DA1F2", color: "#fff" },
    gold: { backgroundColor: "#333", color: "#FFD700" },
  };

  return (
    <main
      style={{
        fontFamily: "sans-serif",
        padding: "2rem",
        maxWidth: 600,
        margin: "auto",
        position: "relative",
      }}
    >
      <h1>🦄 Idle Inc: Startup Tycoon</h1>

      <input
        type="text"
        placeholder="Enter your startup name"
        value={startupName}
        autoFocus
        onChange={(e) => setStartupName(e.target.value)}
        style={{ padding: "0.5rem", width: "100%", marginBottom: "1rem" }}
      />

      <h2>Your Startup: {startupName}</h2>
      <p>
        <strong>Idea:</strong> {product}
      </p>

      <div style={{ marginTop: "1rem" }}>
        <strong>Slogan:</strong>
        <input
          type="text"
          value={slogan}
          onChange={(e) => setSlogan(e.target.value)}
          placeholder="Enter a slogan or use AI"
          style={{
            width: "100%",
            padding: "0.5rem",
            marginTop: "0.25rem",
            marginBottom: "0.5rem",
          }}
        />
        <button onClick={generateSlogan} style={{ padding: "0.5rem 1rem" }}>
          ✨ Generate with AI
        </button>
      </div>

      <div style={{ marginBottom: "1rem", marginTop: "1rem" }}>
        <button onClick={handleWork} style={{ padding: "0.5rem 1rem" }}>
          💼 Work (+${clickPower})
        </button>
        <button
          onClick={handleUpgrade}
          style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}
        >
          🧪 Upgrade (-${50 * level})
        </button>
        <button
          onClick={startNewStartup}
          style={{ padding: "0.5rem 1rem", marginLeft: "0.5rem" }}
        >
          🔁 Restart
        </button>
      </div>

      {eventPopup && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#222",
            color: "#fff",
            padding: "0.75rem 1.5rem",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          {eventPopup}
        </div>
      )}

      {nextMilestone && (
        <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
          🎯 Next unlock at ${nextMilestone.at}
        </p>
      )}

      <h3>📊 Your Founder Stats</h3>
      <ul>
        <li>Total Revenue: ${revenue}</li>
        <li>Click Power: {clickPower}</li>
        <li>Startups Founded: {startupsFounded}</li>
        <li>Best Slogan: “{bestSlogan || "N/A"}”</li>
        <li>Current Theme: {themeUnlocked ? theme : "Locked"}</li>
        <li>Team Unlocked: {unlockedTeam.join(", ") || "None yet"}</li>
      </ul>

      <div style={{ marginTop: "2rem" }}>
        <a
          href={`https://twitter.com/intent/tweet?text=I built ${startupName} and earned $${revenue}! Slogan: "${slogan}" — Try it here: https://idle-inc.vercel.app`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...styleMap[theme],
            padding: "0.5rem 1rem",
            display: "inline-block",
            borderRadius: 6,
          }}
        >
          🔗 Share on Twitter
        </a>
      </div>
    </main>
  );
}
