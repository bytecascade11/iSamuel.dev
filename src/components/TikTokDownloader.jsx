import { useState } from "react";

const API_KEY = ""; // No key needed — uses Claude API proxy approach

// ── Styles ────────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --border: #2a2a3a;
    --accent: #ff2d55;
    --accent2: #fe5c7a;
    --glow: rgba(255, 45, 85, 0.35);
    --text: #f0f0f8;
    --muted: #7a7a9a;
    --success: #00e5a0;
    --warn: #ffb340;
  }

  body {
    font-family: 'DM Mono', monospace;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow-x: hidden;
  }

  .noise {
    position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    opacity: 0.5;
  }

  .orb {
    position: fixed; border-radius: 50%; filter: blur(120px); pointer-events: none; z-index: 0;
  }
  .orb-1 { width: 600px; height: 600px; background: rgba(255,45,85,0.12); top: -200px; right: -100px; }
  .orb-2 { width: 400px; height: 400px; background: rgba(0,229,160,0.06); bottom: -100px; left: -100px; }

  .app { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; }

  /* ── NAV ── */
  nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 48px;
    border-bottom: 1px solid var(--border);
    background: rgba(10,10,15,0.8);
    backdrop-filter: blur(16px);
    position: sticky; top: 0; z-index: 100;
  }
  .logo {
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem;
    display: flex; align-items: center; gap: 10px; letter-spacing: -0.5px;
  }
  .logo-icon {
    width: 34px; height: 34px; background: var(--accent);
    border-radius: 8px; display: grid; place-items: center;
    font-size: 1rem; box-shadow: 0 0 20px var(--glow);
  }
  .logo span { color: var(--accent); }
  .nav-badge {
    font-size: 0.7rem; padding: 4px 10px; border: 1px solid var(--border);
    border-radius: 100px; color: var(--muted); letter-spacing: 1px; text-transform: uppercase;
  }

  /* ── HERO ── */
  .hero {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 24px; text-align: center; gap: 40px;
  }
  .hero-eyebrow {
    font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--accent); padding: 6px 16px; border: 1px solid rgba(255,45,85,0.3);
    border-radius: 100px; background: rgba(255,45,85,0.05);
    animation: fadeUp 0.6s ease both;
  }
  .hero-title {
    font-family: 'Syne', sans-serif; font-weight: 800;
    font-size: clamp(2.8rem, 7vw, 5.5rem); line-height: 1.05;
    letter-spacing: -2px; max-width: 800px;
    animation: fadeUp 0.6s 0.1s ease both;
  }
  .hero-title em { font-style: normal; color: var(--accent); }
  .hero-sub {
    color: var(--muted); max-width: 480px; line-height: 1.7;
    font-size: 0.9rem; animation: fadeUp 0.6s 0.2s ease both;
  }

  /* ── INPUT CARD ── */
  .input-card {
    width: 100%; max-width: 660px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 8px;
    display: flex; gap: 8px;
    box-shadow: 0 8px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,45,85,0.05);
    animation: fadeUp 0.6s 0.3s ease both;
    transition: box-shadow 0.3s;
  }
  .input-card:focus-within {
    box-shadow: 0 8px 60px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,45,85,0.4);
  }
  .url-input {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: 'DM Mono', monospace;
    font-size: 0.88rem; padding: 14px 16px;
    placeholder-color: var(--muted);
  }
  .url-input::placeholder { color: var(--muted); }
  .btn-main {
    background: var(--accent); color: #fff; border: none; cursor: pointer;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.9rem;
    padding: 14px 28px; border-radius: 14px; letter-spacing: 0.3px;
    display: flex; align-items: center; gap: 8px; white-space: nowrap;
    transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
    box-shadow: 0 4px 20px rgba(255,45,85,0.35);
  }
  .btn-main:hover { background: var(--accent2); box-shadow: 0 6px 30px rgba(255,45,85,0.5); }
  .btn-main:active { transform: scale(0.97); }
  .btn-main:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  /* ── RESULT CARD ── */
  .result-card {
    width: 100%; max-width: 660px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; overflow: hidden;
    animation: fadeUp 0.5s ease both;
  }
  .result-preview {
    display: flex; gap: 20px; padding: 24px; align-items: flex-start;
    border-bottom: 1px solid var(--border);
  }
  .thumb-wrap {
    width: 80px; height: 80px; border-radius: 12px; overflow: hidden;
    flex-shrink: 0; background: var(--surface2);
    display: grid; place-items: center; font-size: 2rem;
  }
  .thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
  .result-info { flex: 1; min-width: 0; }
  .result-title {
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.95rem;
    margin-bottom: 6px; line-height: 1.4;
    overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .result-meta { color: var(--muted); font-size: 0.78rem; display: flex; gap: 16px; }
  .result-meta span { display: flex; align-items: center; gap: 4px; }

  .download-options { padding: 16px 24px; display: flex; flex-direction: column; gap: 10px; }
  .options-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 2px; color: var(--muted); margin-bottom: 4px; }
  .format-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .format-btn {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-radius: 12px; cursor: pointer;
    border: 1px solid var(--border); background: var(--surface2);
    color: var(--text); font-family: 'DM Mono', monospace;
    font-size: 0.82rem; transition: all 0.2s; text-decoration: none;
  }
  .format-btn:hover { border-color: var(--accent); background: rgba(255,45,85,0.08); color: var(--accent); }
  .format-badge {
    font-size: 0.65rem; padding: 2px 8px; border-radius: 100px;
    background: rgba(255,45,85,0.15); color: var(--accent); letter-spacing: 0.5px;
  }
  .format-badge.hd { background: rgba(0,229,160,0.15); color: var(--success); }

  /* ── ERROR ── */
  .error-msg {
    max-width: 660px; width: 100%;
    padding: 16px 20px; border-radius: 14px;
    background: rgba(255,45,85,0.08); border: 1px solid rgba(255,45,85,0.25);
    color: var(--accent2); font-size: 0.84rem; display: flex; align-items: center; gap: 10px;
    animation: fadeUp 0.3s ease;
  }

  /* ── HOW IT WORKS ── */
  .how-section { padding: 80px 24px; max-width: 900px; margin: 0 auto; width: 100%; }
  .section-label {
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 3px;
    color: var(--accent); margin-bottom: 32px; text-align: center;
  }
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
  .step {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px 24px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .step:hover { border-color: rgba(255,45,85,0.4); transform: translateY(-2px); }
  .step-num {
    font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800;
    color: rgba(255,45,85,0.2); line-height: 1; margin-bottom: 12px;
  }
  .step h3 { font-family: 'Syne', sans-serif; font-size: 1rem; margin-bottom: 8px; }
  .step p { color: var(--muted); font-size: 0.82rem; line-height: 1.6; }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border); padding: 24px 48px;
    display: flex; align-items: center; justify-content: space-between;
    color: var(--muted); font-size: 0.78rem;
  }
  .footer-note { display: flex; align-items: center; gap: 6px; }
  .dot { width: 6px; height: 6px; background: var(--success); border-radius: 50%; animation: pulse 2s infinite; }

  /* ── SPINNER ── */
  .spinner {
    width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff; border-radius: 50%;
    animation: spin 0.7s linear infinite; display: inline-block;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes pulse {
    0%,100% { opacity: 1; } 50% { opacity: 0.3; }
  }

  @media (max-width: 600px) {
    nav { padding: 16px 20px; }
    footer { flex-direction: column; gap: 10px; text-align: center; }
    .format-grid { grid-template-columns: 1fr; }
  }
`;

// ── Mock TikTok API call via Claude (demo) ─────────────────────────────────
async function fetchVideoInfo(url) {
  // In production, replace with a real TikTok downloader API like:
  // RapidAPI "TikTok Downloader", ssstik.io API, or your backend proxy
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 600,
      system: `You are a mock TikTok API. Given a TikTok URL, respond ONLY with a JSON object (no markdown) with this shape:
{
  "title": "short creative video title based on the URL",
  "author": "@username",
  "duration": "0:15",
  "views": "1.2M",
  "likes": "45.6K",
  "thumbnail": null,
  "formats": [
    { "label": "HD Video", "quality": "1080p", "size": "12.4 MB", "type": "mp4", "hd": true },
    { "label": "SD Video", "quality": "720p",  "size": "7.2 MB",  "type": "mp4", "hd": false },
    { "label": "No Watermark", "quality": "720p", "size": "6.8 MB", "type": "mp4", "hd": false },
    { "label": "Audio Only", "quality": "128kbps", "size": "1.1 MB", "type": "mp3", "hd": false }
  ]
}
Make the title and author creative and realistic. Vary sizes slightly.`,
      messages: [{ role: "user", content: `TikTok URL: ${url}` }],
    }),
  });
  const data = await response.json();
  const text = data.content?.map((b) => b.text || "").join("") || "";
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── Component ──────────────────────────────────────────────────────────────
export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  const isValidTikTok = (u) =>
    /tiktok\.com|vm\.tiktok\.com|vt\.tiktok\.com/.test(u);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isValidTikTok(trimmed)) {
      setError("Please paste a valid TikTok URL (tiktok.com/…)");
      return;
    }
    setError("");
    setVideo(null);
    setLoading(true);
    try {
      const info = await fetchVideoInfo(trimmed);
      setVideo(info);
    } catch {
      setError("Could not fetch video info. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => e.key === "Enter" && handleFetch();

  return (
    <>
      <style>{css}</style>
      <div className="noise" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="app">
        {/* NAV */}
        <nav>
          <div className="logo">
            <div className="logo-icon">▶</div>
            Tik<span>Drop</span>
          </div>
          <div className="nav-badge">Free · No Watermark</div>
        </nav>

        {/* HERO */}
        <main className="hero">
          <div className="hero-eyebrow">TikTok Video Downloader</div>
          <h1 className="hero-title">
            Download any TikTok,<br /><em>in seconds.</em>
          </h1>
          <p className="hero-sub">
            Paste any TikTok link below and grab your video in HD — no watermark,
            no sign-up required.
          </p>

          {/* INPUT */}
          <div className="input-card">
            <input
              className="url-input"
              type="url"
              placeholder="https://www.tiktok.com/@user/video/..."
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(""); }}
              onKeyDown={handleKey}
            />
            <button className="btn-main" onClick={handleFetch} disabled={loading || !url.trim()}>
              {loading ? <span className="spinner" /> : "↓ Fetch"}
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="error-msg">
              <span>⚠</span> {error}
            </div>
          )}

          {/* RESULT */}
          {video && (
            <div className="result-card">
              <div className="result-preview">
                <div className="thumb-wrap">
                  {video.thumbnail ? (
                    <img src={video.thumbnail} alt="thumb" />
                  ) : (
                    <span>🎬</span>
                  )}
                </div>
                <div className="result-info">
                  <div className="result-title">{video.title}</div>
                  <div className="result-meta">
                    <span>👤 {video.author}</span>
                    <span>⏱ {video.duration}</span>
                    <span>👁 {video.views}</span>
                    <span>♥ {video.likes}</span>
                  </div>
                </div>
              </div>

              <div className="download-options">
                <div className="options-label">Choose Format</div>
                <div className="format-grid">
                  {video.formats.map((f, i) => (
                    <a
                      key={i}
                      className="format-btn"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`In production, this would download:\n${f.label} · ${f.quality} · ${f.size}\n\nConnect your backend download API here.`);
                      }}
                    >
                      <span>
                        {f.type === "mp3" ? "🎵" : "🎬"} {f.label}
                        <br />
                        <small style={{ color: "var(--muted)" }}>{f.quality} · {f.size}</small>
                      </span>
                      <span className={`format-badge${f.hd ? " hd" : ""}`}>
                        {f.hd ? "HD" : f.type.toUpperCase()}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>

        {/* HOW IT WORKS */}
        <section className="how-section">
          <div className="section-label">How it works</div>
          <div className="steps">
            {[
              { n: "01", title: "Copy the link", desc: "Open TikTok, tap Share → Copy Link on any video you want." },
              { n: "02", title: "Paste & Fetch", desc: "Drop the URL into the box above and hit Fetch to load video info." },
              { n: "03", title: "Pick your format", desc: "Choose HD, SD, no-watermark, or audio-only — then download instantly." },
            ].map((s) => (
              <div className="step" key={s.n}>
                <div className="step-num">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <span>© 2026 TikDrop — For personal use only</span>
          <div className="footer-note">
            <span className="dot" />
            All systems operational
          </div>
        </footer>
      </div>
    </>
  );
            }
