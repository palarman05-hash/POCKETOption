import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Backend running");
});

// fake candle generator (demo)
function generateCandles() {
  let price = 1.1000;
  const candles = [];

  for (let i = 0; i < 30; i++) {
    const open = price;
    const close = open + (Math.random() - 0.5) * 0.002;
    const high = Math.max(open, close) + Math.random() * 0.001;
    const low = Math.min(open, close) - Math.random() * 0.001;

    candles.push({
      time: Math.floor(Date.now() / 1000) - (30 - i) * 60,
      open,
      high,
      low,
      close
    });

    price = close;
  }
  return candles;
}

app.get("/signal", (req, res) => {
  const candles = generateCandles();
  const direction = Math.random() > 0.5 ? "BUY" : "SELL";
  const confidence = Math.floor(Math.random() * 15) + 80;

  res.json({
    pair: req.query.pair,
    tf: req.query.tf,
    candles,
    direction,
    confidence,
    trend: direction === "BUY" ? "UP" : "DOWN",
    avoid: confidence < 85
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Backend running"));
