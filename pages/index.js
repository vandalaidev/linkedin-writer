export default function Home() {
  const [topic, setTopic] = React.useState("");
  const [tone, setTone] = React.useState("professional");
  const [goal, setGoal] = React.useState("engagement");
  const [post, setPost] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const generatePost = async () => {
    if (!topic.trim()) return alert("Enter a topic");
    setLoading(true);
    setPost("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, goal }),
      });
      const data = await res.json();
      setPost(data.post || "Error generating post");
    } catch (err) {
      setPost("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(post);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: "linear-gradient(to br, #0a66c2, #0d2c5a)", minHeight: "100vh", color: "#fff", padding: "40px 20px" }}>
      <style>{`
        body { margin: 0; font-family: sans-serif; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .header h1 { font-size: 48px; margin: 0; }
        .header p { color: "#00d4ff"; margin: 10px 0 0 0; }
        .grid { display: grid; grid-template-columns: 1fr 2fr; gap: 30px; }
        @media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
        .panel { background: rgba(0,0,0,0.3); border: 1px solid rgba(0,212,255,0.2); border-radius: 16px; padding: 30px; }
        .form-group { margin-bottom: 25px; }
        .form-group label { display: block; font-weight: 600; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
        textarea, select { width: 100%; padding: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(0,212,255,0.3); border-radius: 8px; color: #fff; font-family: inherit; }
        textarea:focus, select:focus { outline: none; border-color: #00d4ff; box-shadow: 0 0 0 2px rgba(0,212,255,0.1); }
        .options { display: grid; gap: 8px; }
        .option-btn { padding: 10px 14px; background: rgba(255,255,255,0.08); border: 2px solid rgba(0,212,255,0.2); border-radius: 8px; color: #fff; cursor: pointer; font-weight: 500; transition: all 0.2s; }
        .option-btn:hover { background: rgba(0,212,255,0.1); border-color: #00d4ff; }
        .option-btn.active { background: #0066ff; border-color: #0099ff; }
        .btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #0066ff, #00ccff); border: none; border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
        .btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,102,255,0.3); }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .post-box { background: rgba(255,255,255,0.05); border: 1px solid rgba(0,212,255,0.2); border-radius: 12px; padding: 20px; margin-bottom: 20px; min-height: 150px; }
        .post-content { white-space: pre-wrap; word-break: break-word; line-height: 1.6; }
      `}</style>

      <div className="container">
        <div className="header">
          <h1>✨ LinkedIn Post Writer</h1>
          <p>Generate authentic posts that drive engagement</p>
        </div>

        <div className="grid">
          <div className="panel">
            <div className="form-group">
              <label>Topic</label>
              <textarea value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Just launched my new AI tool..." rows="4" />
            </div>

            <div className="form-group">
              <label>Tone</label>
              <div className="options">
                {["professional", "casual", "thought-leader", "storyteller", "humorous"].map((t) => (
                  <button key={t} className={`option-btn ${tone === t ? "active" : ""}`} onClick={() => setTone(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Goal</label>
              <div className="options">
                {["engagement", "leads", "thought-leadership", "viral", "inspiration"].map((g) => (
                  <button key={g} className={`option-btn ${goal === g ? "active" : ""}`} onClick={() => setGoal(g)}>
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button className="btn" onClick={generatePost} disabled={loading || !topic.trim()}>
              {loading ? "Generating..." : "Generate Post"}
            </button>
          </div>

          <div className="panel">
            {post ? (
              <>
                <div className="post-box">
                  <div className="post-content">{post}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <button className="btn" onClick={copyToClipboard}>{copied ? "✓ Copied!" : "Copy"}</button>
                  <button className="btn" onClick={generatePost} disabled={loading}>Regenerate</button>
                </div>
              </>
            ) : (
              <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.5)" }}>
                ✨ Enter a topic to get started
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
