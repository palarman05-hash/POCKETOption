const { ema } = require("../indicators/ema");
const { rsi } = require("../indicators/rsi");
const { trend } = require("../indicators/trend");

function generateSignal(candles) {
  const closes = candles.map(c => c.close);

  const e20 = ema(20, closes).pop();
  const e50 = ema(50, closes).pop();
  const e200 = ema(200, closes).pop();

  const r = rsi(14, closes);
  const t = trend(e20, e50, e200);

  let signal = "NO TRADE";
  let confidence = 0;
  let reason = [];

  if (t === "UP" && r < 65) {
    signal = "CALL";
    confidence = 75;
    reason.push("Uptrend + RSI ok");
  }

  if (t === "DOWN" && r > 35) {
    signal = "PUT";
    confidence = 75;
    reason.push("Downtrend + RSI ok");
  }

  if (t === "SIDEWAYS") {
    reason.push("Sideways market");
  }

  return {
    signal,
    confidence,
    trend: t,
    reason: reason.join(", ")
  };
}

module.exports = { generateSignal };
