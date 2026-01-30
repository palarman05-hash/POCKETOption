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
import { useEffect, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import "./App.css";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const chartRef = useRef();
  const [data, setData] = useState(null);
  const [pair, setPair] = useState("EURUSD");

  useEffect(() => {
    if (!data) return;

    chartRef.current.innerHTML = "";
    const chart = createChart(chartRef.current, {
      width: 400,
      height: 250,
      layout: { background: { color: "#020617" }, textColor: "white" },
      grid: { vertLines: { color: "#111" }, horzLines: { color: "#111" } }
    });

    const series = chart.addCandlestickSeries();
    series.setData(data.candles);

  }, [data]);

  const getSignal = async () => {
    const res = await fetch(`${API}/signal?pair=${pair}&tf=1m`);
    const json = await res.json();
    setData(json);
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Finorix Signal</h1>

        <select onChange={e => setPair(e.target.value)}>
          <option>EURUSD</option>
          <option>GBPUSD</option>
          <option>USDJPY</option>
        </select>

        <button onClick={getSignal}>Get Signal</button>

        <div ref={chartRef} style={{ marginTop: 14 }} />

        {data && (
          <div className={`signal ${
            data.avoid ? "avoid" :
            data.direction === "BUY" ? "buy" : "sell"
          }`}>
            <h2>{data.avoid ? "AVOID" : data.direction}</h2>
            <p>Confidence: {data.confidence}%</p>
            <p>Trend: {data.trend}</p>
          </div>
        )}
      </div>
    </div>
  );
}
