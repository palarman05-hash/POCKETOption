import { useState } from "react";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [pair, setPair] = useState("EURUSD");
  const [otc, setOtc] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getSignal = async () => {
    setLoading(true);
    setData(null);
    try {
      const res = await fetch(
        `${API}/signal?pair=${otc ? "OTC-" + pair : pair}`
      );
      const json = await res.json();
      setData(json);
    } catch (e) {
      alert("Backend connect nahi ho raha");
    }
    setLoading(false);
  };

  const color =
    data?.signal === "CALL"
      ? "#16a34a"
      : data?.signal === "PUT"
      ? "#dc2626"
      : "#6b7280";

  return (
    <div style={styles.app}>
      <h1 style={styles.title}>Finorix Pro</h1>

      {/* Pair + OTC */}
      <div style={styles.row}>
        <select
          value={pair}
          onChange={(e) => setPair(e.target.value)}
          style={styles.select}
        >
          <option>EURUSD</option>
          <option>GBPUSD</option>
          <option>USDJPY</option>
          <option>BTCUSD</option>
        </select>

        <label style={styles.otc}>
          <input
            type="checkbox"
            checked={otc}
            onChange={() => setOtc(!otc)}
          />
          OTC
        </label>
      </div>

      {/* Signal Card */}
      <div style={styles.card}>
        {loading && <p>Analyzing market...</p>}

        {!loading && !data && (
          <p style={{ opacity: 0.7 }}>Click GET SIGNAL</p>
        )}

        {data && (
          <>
            <h2 style={{ ...styles.signal, color }}>{data.signal}</h2>

            <div style={styles.barBg}>
              <div
                style={{
                  ...styles.barFill,
                  width: `${data.confidence}%`,
                  background: color,
                }}
              />
            </div>

            <p>Confidence: {data.confidence}%</p>
            <p>Expiry: {data.expiry}</p>
            <p style={{ opacity: 0.8 }}>{data.reason}</p>
          </>
        )}
      </div>

      {/* Button */}
      <button onClick={getSignal} style={styles.btn} disabled={loading}>
        {loading ? "WAIT..." : "GET SIGNAL"}
      </button>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  app: {
    minHeight: "100vh",
    background: "#0b0f1a",
    color: "#e5e7eb",
    padding: 20,
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  select: {
    background: "#111827",
    color: "#fff",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #374151",
  },
  otc: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 14,
  },
  card: {
    background: "#111827",
    borderRadius: 12,
    padding: 20,
    textAlign: "center",
    marginBottom: 20,
    border: "1px solid #1f2937",
  },
  signal: {
    fontSize: 32,
    marginBottom: 10,
  },
  barBg: {
    width: "100%",
    height: 10,
    background: "#1f2937",
    borderRadius: 5,
    marginBottom: 10,
  },
  barFill: {
    height: "100%",
    borderRadius: 5,
  },
  btn: {
    width: "100%",
    padding: 15,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 18,
    cursor: "pointer",
  },
};
