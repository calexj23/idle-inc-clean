import React, { useState, useEffect } from "react";

type StartupEvent = {
  text: string;
  options: {
    label: string;
    effect: (revenue: number, clickPower: number) => number | { r?: number; cp?: number };
  }[];
};

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

const slogans = [
  "Disrupting mediocrity with chaotic brilliance.",
  "Where AI meets WTF.",
  "Powering the future with jokes and code.",
  "The smartest bad idea you'll ever fund.",
  "Serving nonsense. At scale.",
];

const eventPrompts: StartupEvent[] = [
  {
    text: "Your AI toaster went viral on TikTok. Do you sell it to a VC?",
    options: [
      { label: "Sell and cash out (+$100)", effect: (r) => r + 100 },
      { label: "Stay indie (double click power)", effect: (r, cp) => ({ cp: cp * 2 }) },
    ],
  },
  {
    text: "A user trained your app to say bad words. Do damage control?",
    options: [
      { label: "Hire PR firm (-$50)", effect: (r) => r - 50 },
      { label: "Ignore and rebrand (reset revenue)", effect: () => ({ r: 0 }) },
    ],
  },
];

export default function Home() {
  const [revenue, setRevenue] = useState<number>(0);
  const [product, setProduct] = useState<string>(productIdeas[0]);
  const [clickPower, setClickPower] = useState<number>(1);
  const [level, setLevel] = useState<number>(1);
  const [event, setEvent] = useState<StartupEvent | null>(null);
  const [floatingCash, setFloatingCash] = useState<number[]>([]);
  const [passivePower, setPassivePower] = useState<number>(0);
  const [upgradeMsg, setUpgradeMsg] = useState<string>("");
  const [slogan, setSlogan] = useState<string>("");

  const handleWork = () => {
    setRevenue((prev) => prev + clickPower);
    const id = Date.now();
    setFloatingCash((prev) => [...prev, id]);
    setTimeout(() => {
      setFloatingCash((prev) => prev.filter((cashId) => cashId !== id));
    }, 800);

    if (Math.random() < 0.05) {
      const e = eventPrompts[Math.floor(Math.random() * eventPrompts.length)];
      setEvent(e);
    }
  };

  const handleUpgrade = () => {
    const cost = 50 * level;
    if (revenue >= cost) {
      setRevenue(revenue - cost);
      setClickPower(clickPower + 1);
      setLevel(level + 1);
      const flavor = upgradeFlavors[Math.floor(Math.random() * upgradeFlavors.length)];
      setUpgradeMsg(flavor);
      setTimeout(() => setUpgradeMsg(""), 2000);
    }
  };

  const handleNewIdea = () => {
    const next = productIdeas[Math.floor(Math.random() * productIdeas.length)];
    setProduct(next);
    setRevenue(0);
    setClickPower(1);
    setLevel(1);
    setPassivePower(0);
    setSlogan("");
  };

  const handleEventChoice = (option: StartupEvent["options"][number]) => {
    const result = option.effect(revenue, clickPower);
    if (typeof result === "object") {
      if (result.r !== undefined) setRevenue(result.r);
      if (result.cp !== undefined) setClickPower(result.cp);
    } else {
      setRevenue(result);
    }
    setEvent(null);
  };

  const handleGenerateSlogan = () => {
    const s = slogans[Math.floor(Math.random() * slogans.length)];
    setSlogan(s);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRevenue((rev) => rev + passivePower);
    }, 1000);
    return () => clearInterval(interval);
  }, [passivePower]);

  const shareText = encodeURIComponent(
    `🚀 I built a startup in Idle Inc: "${product}" and earned $${revenue}! Slogan: "${slogan}" Play here 👉`
  );
  const shareUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=https://your-vercel-site.vercel.app`;

  return (
    <main style={{ fontFamily: "sans-serif", padding: "2rem", maxWidth: 600, margin: "auto", position: "relative" }}>
      <h1>🦄 Idle Inc: Startup Tycoon</h1>
      <p>Build your weird AI startup and earn 💰 while having fun.</p>

      <h2>💡 Your Startup:</h2>
      <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{product}</p>
      {slogan && <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>🏷️ {slogan}</p>}
      <button onClick={handleGenerateSlogan} style={btnStyle}>✨ Generate Slogan</button>

      <h3>📈 Revenue: ${revenue}</h3>
      <p>💪 Click Power: {clickPower} | 📊 Level: {level} | 💸 Passive: ${passivePower}/sec</p>

      <button onClick={handleWork} style={btnStyle}>
        Work 💼 (+${clickPower})
      </button>{" "}
      <button onClick={handleUpgrade} style={btnStyle}>
        Upgrade 🧪 (-${50 * level})
      </button>{" "}
      <button onClick={() => setPassivePower(passivePower + 1)} style={btnStyle}>
        Invest in AutoBot 🤖
      </button>{" "}
      <button onClick={handleNewIdea} style={btnStyle}>
        Start New Startup 🔁
      </button>

      {upgradeMsg && <p style={{ marginTop: "1rem", fontStyle: "italic" }}>📈 {upgradeMsg}</p>}

      {event && (
        <div style={eventBoxStyle}>
          <h3>⚠️ Startup Event!</h3>
          <p>{event.text}</p>
          {event.options.map((opt, idx) => (
            <button key={idx} onClick={() => handleEventChoice(opt)} style={btnStyle}>
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {floatingCash.map((id) => (
        <div key={id} style={floatingStyle}>+${clickPower}</div>
      ))}

      <div style={{ marginTop: "2rem" }}>
        <a href={shareUrl} target="_blank" rel="noopener noreferrer" style={shareStyle}>
          🔗 Share on Twitter
        </a>
      </div>
    </main>
  );
}

const btnStyle = {
  padding: "0.6rem 1rem",
  margin: "0.5rem 0.3rem",
  fontSize: "16px",
  cursor: "pointer",
};

const shareStyle = {
  background: "#1DA1F2",
  color: "#fff",
  padding: "0.6rem 1rem",
  textDecoration: "none",
  borderRadius: "6px",
};

const floatingStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  animation: "fadeUp 0.8s ease-out forwards",
  background: "rgba(255,255,255,0.8)",
  padding: "0.4rem 0.8rem",
  borderRadius: "6px",
  pointerEvents: "none",
};

const eventBoxStyle = {
  background: "#fff3cd",
  border: "1px solid #ffeeba",
  padding: "1rem",
  marginTop: "2rem",
  borderRadius: "8px",
};
