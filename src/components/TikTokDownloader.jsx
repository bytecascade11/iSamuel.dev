import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

  .tikdrop-wrap * { box-sizing: border-box; }

  .tikdrop-wrap {
    width: 100%;
    padding: 20px 0 48px;
    font-family: inherit;
  }

  /* INPUT CARD */
  .td-card {
    background: #ffffff;
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 8px;
    display: flex;
    gap: 8px;
    max-width: 680px;
    margin: 0 auto 10px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .td-card:focus-within {
    border-color: #6366f1;
    box-shadow: 0 4px 24px rgba(99,102,241,0.12);
  }
  .td-input {
    flex: 1; border: none; outline: none;
    font-size: 1rem; padding: 14px 16px;
    background: transparent; color: #1f2937;
    font-family: inherit;
  }
  .td-input::placeholder { color: #9ca3af; }
  .td-btn {
    background: #6366f1;
    color: #fff; border: none; cursor: pointer;
    font-weight: 700; font-size: 0.95rem;
    padding: 14px 28px; border-radius: 10px;
    display: flex; align-items: center; gap: 8px;
    white-space: nowrap;
    transition: background 0.2s, transform 0.1s;
    box-shadow: 0 2px 12px rgba(99,102,241,0.3);
  }
  .td-btn:hover { background: #4f46e5; }
  .td-btn:active { transform: scale(0.97); }
  .td-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

  /* HINT */
  .td-hint {
    text-align: center; font-size: 0.85rem;
    color: #9ca3af; margin-bottom: 28px;
  }

  /* ERROR */
  .td-error {
    max-width: 680px; margin: 0 auto 16px;
    padding: 14px 20px; border-radius: 10px;
    background: #fef2f2; border: 1px solid #fecaca;
    color: #dc2626; font-size: 0.9rem;
    display: flex; align-items: center; gap: 8px;
  }

  /* RESULT */
  .td-result {
    max-width: 680px; margin: 0 auto;
    background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    animation: tdFadeUp 0.4s ease;
  }
  .td-result-top {
    display: flex; gap: 16px; padding: 22px;
    border-bottom: 1px solid #f3f4f6; align-items: flex-start;
  }
  .td-thumb {
    width: 80px; height: 80px; border-radius: 10px;
    background: #f3f4f6; display: grid; place-items: center;
    font-size: 2rem; flex-shrink: 0; overflow: hidden;
  }
  .td-thumb img { width: 100%; height: 100%; object-fit: cover; }
  .td-info { flex: 1; min-width: 0; }
  .td-title {
    font-weight: 700; font-size: 1rem; color: #111827;
    margin-bottom: 8px; line-height: 1.4;
    overflow: hidden; display: -webkit-box;
    -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  }
  .td-meta {
    display: flex; flex-wrap: wrap; gap: 12px;
    font-size: 0.82rem; color: #6b7280;
  }

  /* FORMATS */
  .td-formats { padding: 18px 22px; }
  .td-formats-label {
    font-size: 0.75rem; text-transform: uppercase;
    letter-spacing: 1.5px; color: #9ca3af;
    margin-bottom: 14px; font-weight: 600;
  }
  .td-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .td-fmt {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 18px; border-radius: 10px;
    border: 1.5px solid #e5e7eb; background: #f9fafb;
    cursor: pointer; text-decoration: none;
    transition: all 0.18s; color: #374151;
  }
  .td-fmt:hover {
    border-color: #6366f1; background: #eef2ff; color: #4f46e5;
  }
  .td-fmt-left { display: flex; flex-direction: column; gap: 3px; }
  .td-fmt-name { font-weight: 600; font-size: 0.9rem; }
  .td-fmt-size { font-size: 0.78rem; color: #9ca3af; }
  .td-badge {
    font-size: 0.68rem; padding: 3px 10px; border-radius: 100px;
    font-weight: 700; letter-spacing: 0.5px;
    background: #e0e7ff; color: #6366f1;
  }
  .td-badge.hd { background: #d1fae5; color: #059669; }
  .td-badge.mp3 { background: #fef3c7; color: #d97706; }

  /* HOW IT WORKS */
  .td-steps {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px; max-width: 680px; margin: 40px auto 0;
  }
  .td-step {
    background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 14px; padding: 24px 20px;
    transition: border-color 0.2s, transform 0.2s;
  }
  .td-step:hover { border-color: #6366f1; transform: translateY(-2px); }
  .td-step-num {
    font-size: 2.2rem; font-weight: 800; color: #e0e7ff;
    line-height: 1; margin-bottom: 12px;
    font-family: 'Syne', sans-serif;
  }
  .td-step h3 { font-size: 0.95rem; font-weight: 700; color: #111827; margin-bottom: 8px; }
  .td-step p { font-size: 0.84rem; color: #6b7280; line-height: 1.6; }

  /* SPINNER */
  .td-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: #fff; border-radius: 50%;
    animation: tdSpin 0.7s linear infinite; display: inline-block;
  }

  @keyframes tdSpin { to { transform: rotate(360deg); } }
  @keyframes tdFadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 520px) {
    .td-grid { grid-template-columns: 1fr; }
    .td-btn { padding: 14px 18px; font-size: 0.9rem; }
  }
`;

async function fetchVideoInfo(url) {
  const response = await fetch(
    `/api/download?url=${encodeURIComponent(url)}`
  );
  const data = await response.json();

  if (!data || data.error) {
    throw new Error(data?.error || "Failed to fetch video info");
  }

  return {
    title: data.data?.title || "TikTok Video",
    author: data.data?.author?.nickname
      ? "@" + data.data.author.nickname
      : "@user",
    duration: data.data?.duration
      ? Math.floor(data.data.duration / 60) + ":" + String(data.data.duration % 60).padStart(2, "0")
      : "0:00",
    views: data.data?.play_count
      ? Number(data.data.play_count).toLocaleString()
      : "0",
    likes: data.data?.digg_count
      ? Number(data.data.digg_count).toLocaleString()
      : "0",
    thumbnail: data.data?.cover || null,
    formats: [
      {
        label: "HD Video",
        quality: "1080p",
        size: "Best Quality",
        type: "mp4",
        hd: true,
        url: data.data?.hdplay || data.data?.play || null,
      },
      {
        label: "SD Video",
        quality: "720p",
        size: "Smaller Size",
        type: "mp4",
        hd: false,
        url: data.data?.play || null,
      },
      {
        label: "No Watermark",
        quality: "720p",
        size: "Clean Version",
        type: "mp4",
        hd: false,
        url: data.data?.wmplay || null,
      },
      {
        label: "Audio Only",
        quality: "128kbps",
        size: "MP3 Format",
        type: "mp3",
        hd: false,
        url: data.data?.music || null,
      },
    ],
  };
}

export default function TikTokDownloader() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [video, setVideo] = useState(null);
  const [error, setError] = useState("");

  const isValid = (u) => /tiktok\.com|vm\.tiktok\.com/.test(u);

  const handleFetch = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    if (!isValid(trimmed)) {
      setError("Please paste a valid TikTok URL.");
      return;
    }
    setError(""); setVideo(null); setLoading(true);
    try {
      setVideo(await fetchVideoInfo(trimmed));
    } catch {
      setError("Could not fetch video info. Check the URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const badgeClass = (f) => {
    if (f.hd) return "td-badge hd";
    if (f.type === "mp3") return "td-badge mp3";
    return "td-badge";
  };

  return (
    <>
      <style>{css}</style>
      <div className="tikdrop-wrap">

        {/* Input */}
        <div className="td-card">
          <input
            className="td-input"
            type="url"
            placeholder="Paste TikTok link here... https://www.tiktok.com/@user/video/..."
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          />
          <button className="td-btn" onClick={handleFetch} disabled={loading || !url.trim()}>
            {loading ? <span className="td-spinner" /> : "↓ Download"}
          </button>
        </div>

        <p className="td-hint">100% Free · No Watermark · No Sign-up Needed</p>

        {/* Error */}
        {error && <div className="td-error"><span>⚠</span> {error}</div>}

        {/* Result */}
        {video && (
          <div className="td-result">
            <div className="td-result-top">
              <div className="td-thumb">
                {video.thumbnail ? <img src={video.thumbnail} alt="thumb" /> : "🎬"}
              </div>
              <div className="td-info">
                <div className="td-title">{video.title}</div>
                <div className="td-meta">
                  <span>👤 {video.author}</span>
                  <span>⏱ {video.duration}</span>
                  <span>👁 {video.views}</span>
                  <span>♥ {video.likes}</span>
                </div>
              </div>
            </div>
            <div className="td-formats">
              <div className="td-formats-label">Choose Your Format</div>
              <div className="td-grid">
                {video.formats.map((f, i) => (
                  <a
                    key={i}
                    className="td-fmt"
                    href={f.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!f.url) {
                        e.preventDefault();
                        alert("Download link not available for this format.");
                      }
                    }}
                  >
                    <div className="td-fmt-left">
                      <span className="td-fmt-name">
                        {f.type === "mp3" ? "🎵" : "🎬"} {f.label}
                      </span>
                      <span className="td-fmt-size">{f.quality} · {f.size}</span>
                    </div>
                    <span className={badgeClass(f)}>
                      {f.hd ? "HD" : f.type.toUpperCase()}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div id="how-it-works" className="td-steps">
          {[
            {
              n: "01",
              title: "Copy the Link",
              desc: "Open TikTok, tap Share → Copy Link on any video you want to save.",
            },
            {
              n: "02",
              title: "Paste & Download",
              desc: "Paste the URL into the box above and hit the Download button.",
            },
            {
              n: "03",
              title: "Pick Your Format",
              desc: "Choose HD video, SD, no watermark version, or MP3 audio only.",
            },
          ].map((s) => (
            <div className="td-step" key={s.n}>
              <div className="td-step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </>
  );
               }
