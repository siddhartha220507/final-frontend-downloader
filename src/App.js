import { useState } from "react";
import axios from "axios";
import "./App.css";

// API URL - uses environment variable or defaults to localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getInfo = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await axios.post(`${API_URL}/api/info`, { url });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch video info");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (formatId) => {
    const downloadUrl = `${API_URL}/api/download?url=${encodeURIComponent(url)}&format_id=${formatId}`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <div className="container">
      <header className="header">
        <h1>🎬 YouTube Downloader</h1>
        <p>Fast & Easy Video Download</p>
      </header>

      <div className="input-section">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && getInfo()}
          placeholder="Paste YouTube URL here..."
          className="input-field"
        />
        <button onClick={getInfo} disabled={loading} className="btn-primary">
          {loading ? "⏳ Loading..." : "🔍 Get Info"}
        </button>
      </div>

      {error && <div className="error-box">{error}</div>}

      {data && (
        <div className="video-info">
          <div className="video-header">
            <img src={data.thumbnail} alt={data.title} className="thumbnail" />
            <div className="video-details">
              <h2>{data.title}</h2>
              <p>Duration: {Math.floor(data.duration / 60)} minutes</p>
            </div>
          </div>

          <div className="formats-section">
            {data.videoFormats && data.videoFormats.length > 0 && (
              <div className="format-group">
                <h3>🎥 Video Formats</h3>
                <div className="formats-grid">
                  {data.videoFormats.map((f, i) => (
                    <div key={i} className="format-card">
                      <div className="format-info">
                        <span className="quality">{f.quality}</span>
                        <span className="ext">{f.ext.toUpperCase()}</span>
                        {f.filesize && (
                          <span className="filesize">
                            {(f.filesize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownload(f.format_id)}
                        className="btn-download"
                      >
                        ⬇️ Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.audioFormats && data.audioFormats.length > 0 && (
              <div className="format-group">
                <h3>🎵 Audio Formats</h3>
                <div className="formats-grid">
                  {data.audioFormats.map((f, i) => (
                    <div key={i} className="format-card">
                      <div className="format-info">
                        <span className="quality">{f.quality}</span>
                        <span className="ext">{f.ext.toUpperCase()}</span>
                        {f.filesize && (
                          <span className="filesize">
                            {(f.filesize / 1024 / 1024).toFixed(2)} MB
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => handleDownload(f.format_id)}
                        className="btn-download"
                      >
                        ⬇️ Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
