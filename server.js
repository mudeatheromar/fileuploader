require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./models");
const authRoutes = require("./routes/auth");

const app = express();

// ✅ CORS Configuration to Allow Requests from Any Origin (Local Testing)
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5005;

db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced");
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
  })
  .catch((err) => console.error("❌ Error syncing database:", err));

app.listen(PORT, () => {
  console.log(`🌍 API is live at: http://localhost:${PORT}`);
});