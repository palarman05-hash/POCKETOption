function rsi(period, prices) {
  let gains = 0, losses = 0;

  for (let i = prices.length - period; i < prices.length - 1; i++) {
    const diff = prices[i + 1] - prices[i];
    diff >= 0 ? gains += diff : losses -= diff;
  }

  const rs = gains / (losses || 1);
  return 100 - 100 / (1 + rs);
}

module.exports = { rsi };
