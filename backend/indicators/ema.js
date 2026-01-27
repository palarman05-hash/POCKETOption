function ema(period, prices) {
  const k = 2 / (period + 1);
  let prev = prices[0];
  let result = [];

  for (let price of prices) {
    const val = price * k + prev * (1 - k);
    result.push(val);
    prev = val;
  }
  return result;
}

module.exports = { ema };
