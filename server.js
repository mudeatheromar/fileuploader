require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models");
const { Folder } = require("./models");


// Routes
const authRoutes = require("./routes/auth");
const uploadRoute = require("./routes/upload");
const folderRoutes = require("./routes/folder");
const fileRoutes = require("./routes/file");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Root Test Route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// ✅ Route Mounting
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoute);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);

app.get("/test", async (req, res) => {
  try {
    const folders = await Folder.findAll();
    res.json(folders);
  } catch (err) {
    console.error("Test endpoint error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Server & DB Start
const PORT = process.env.PORT || 5018;

db.sequelize
  .sync()
  .then(() => {
    console.log("✅ Database synced");
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    app.listen(PORT, () => {
      console.log(`🌍 API is live at: http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ Error syncing database:", err));