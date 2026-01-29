import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [pair, setPair] = useState("EUR/USD");
  const [tf, setTf] = useState("1min");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getSignal = async () => {
    if (!API) {
      setError("API URL missing (VITE_API_URL)");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(
        `${API}/signal?pair=${pair}&tf=${tf}`
      );

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Signal fetch failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Finorix Signal App</h2>

      <div>
        <label>Pair: </label>
        <select value={pair} onChange={e => setPair(e.target.value)}>
          <option value="EUR/USD">EUR/USD</option>
          <option value="GBP/USD">GBP/USD</option>
        </select>
      </div>

      <div>
        <label>Timeframe: </label>
        <select value={tf} onChange={e => setTf(e.target.value)}>
          <option value="1min">1 Minute</option>
          <option value="5min">5 Minute</option>
        </select>
      </div>

      <button onClick={getSignal} disabled={loading}>
        {loading ? "Loading..." : "Get Signal"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      {data && (
        <div style={{ marginTop: 20 }}>
          <p><b>Signal:</b> {data.signal}</p>
          <p><b>Confidence:</b> {data.confidence}%</p>
          <p><b>Trend:</b> {data.trend}</p>
          <p><b>Reason:</b> {data.reason}</p>
        </div>
      )}
    </div>
  );
}
