function trend(ema20, ema50, ema200) {
  if (ema20 > ema50 && ema50 > ema200) return "UP";
  if (ema20 < ema50 && ema50 < ema200) return "DOWN";
  return "SIDEWAYS";
}

module.exports = { trend };
