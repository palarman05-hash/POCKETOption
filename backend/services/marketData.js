const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getCandles(pair, tf = "1min") {
  const apiKey = process.env.TWELVE_API_KEY;

  const url = `https://api.twelvedata.com/time_series?symbol=${pair}&interval=${tf}&outputsize=100&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.values) {
    throw new Error("No candle data");
  }

  return data.values.reverse().map(c => ({
    open: Number(c.open),
    close: Number(c.close),
    high: Number(c.high),
    low: Number(c.low)
  }));
}

module.exports = { getCandles };
