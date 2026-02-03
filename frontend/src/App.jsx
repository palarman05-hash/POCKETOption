import { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function App() {
  const [pair, setPair] = useState("EURUSD");
  const [timeframe, setTimeframe] = useState("1m");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSignal = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await fetch(
        `${API_URL}/signal?pair=${pair}&tf=${timeframe}`
      );

      if (!res.ok) {
        throw new Error("Backend response failed");
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Signal fetch failed. Backend not responding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>Finorix Signal App</h2>

      {/* Pair Select */}
      <div style={{ marginBottom: 10 }}>
        <label>Pair: </label>
        <select value={pair} onChange={(e) => setPair(e.target.value)}>
          <optgroup label="Market">
            <option value="EURUSD">EUR/USD</option>
            <option value="GBPUSD">GBP/USD</option>
            <option value="USDJPY">USD/JPY</option>
          </optgroup>

          <optgroup label="OTC">
            <option value="OTC_EURUSD">OTC EUR/USD</option>
            <option value="OTC_GBPUSD">OTC GBP/USD</option>
            <option value="OTC_USDJPY">OTC USD/JPY</option>
          </optgroup>
        </select>
      </div>

      {/* Timeframe */}
      <div style={{ marginBottom: 10 }}>
        <label>Timeframe: </label>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          <option value="1m">1 Minute</option>
          <option value="5m">5 Minute</option>
          <option value="15m">15 Minute</option>
        </select>
      </div>

      {/* Button */}
      <button onClick={getSignal} disabled={loading}>
        {loading ? "Loading..." : "Get Signal"}
      </button>

      {/* Error */}
      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      {/* Result */}
      {data && (
        <div style={{ marginTop: 20 }}>
          <p><b>Signal:</b> {data.signal}</p>
          <p><b>Confidence:</b> {data.confidence}%</p>
          <p><b>Trend:</b> {data.trend}</p>
          <p><b>Reason:</b> {data.reason}</p>

          {pair.startsWith("OTC") && (
            <p style={{ color: "orange" }}>
              ⚠ OTC Pair Detected
            </p>
          )}
        </div>
      )}
    </div>
  );
}
