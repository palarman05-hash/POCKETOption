const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/signal", (req, res) => {
  res.json({
    pair: "EURUSD",
    signal: "CALL",
    confidence: 72,
    expiry: "1m",
    reason: "Demo signal"
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
