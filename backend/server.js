const express = require("express");
const cors = require("cors");

const { getCandles } = require("./services/marketData");
const { generateSignal } = require("./logic/signalEngine");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/signal", async (req, res) => {
  try {
    const pair = req.query.pair || "EUR/USD";
    const tf = req.query.tf || "1min";

    const candles = await getCandles(pair, tf);
    const signal = generateSignal(candles);

    res.json({ pair, timeframe: tf, ...signal });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
