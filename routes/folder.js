const express = require("express");
const router = express.Router();
const { Folder } = require("../models");
const { File } = require("../models");

const authenticateToken = require("../middlewears/auth");

// Apply token auth to all folder routes
router.use(authenticateToken);

// POST /api/folders - Create a new folder
router.post("/", async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: "Folder name is required." });
  }

  try {
    const folder = await Folder.create({ name, userId });
    res.status(201).json(folder);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to create folder", details: err.message });
  }
});

// ✅ GET /api/folders - Get all folders for the authenticated user
router.get("/", async (req, res) => {
    try {
      console.log("Authenticated user:", req.user); // Log user info for debugging
      const userId = req.user.id;
      const folders = await Folder.findAll({ where: { userId } });
      res.json(folders);
    } catch (err) {
      console.error("Error fetching folders:", err); // Log the full error
      res.status(500).json({ error: "Internal server error" });
    }
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
  
    try {
      const folder = await Folder.findOne({
        where: { id, userId },
        include: [{ model: File, as: "files" }]
      });
  
      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }
  
      res.json({ folder, files: folder.files });
    } catch (err) {
      console.error("Error fetching folder with files:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
module.exports = router;