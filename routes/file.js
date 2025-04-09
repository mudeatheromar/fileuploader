const express = require("express");
const router = express.Router();
const upload = require("../middlewears/uploadMiddlewear");
const { File } = require("../models");
const authenticate = require("../middlewears/auth");

// POST /api/files
router.post("/", authenticate, upload.single("file"), async (req, res) => {
  try {
    const { folderId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "❌ No file uploaded" });
    }

    console.log("✅ Uploaded file:", req.file);
    console.log("👤 Authenticated user:", req.user);

    const file = await File.create({
      name: req.file.originalname,
      path: req.file.path, // Cloudinary URL
      folderId: folderId || null,
      userId: req.user.id 
       });

    return res.status(201).json({
      message: "✅ File uploaded successfully",
      file,
    });

  } catch (err) {
    console.error("🔥 Upload Error:");
    console.error(err); // Full error in terminal

    return res.status(500).json({
      message: "❌ Failed to upload file",
      error: err.message,
      name: err.name,
      stack: err.stack,
      raw: JSON.stringify(err, Object.getOwnPropertyNames(err), 2),
    });
  }
});

// GET /api/files
router.get("/", authenticate, async (req, res) => {
  try {
    const files = await File.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "path", "folderId", "createdAt"],
    });

    res.status(200).json({ files });
  } catch (err) {
    console.error("Fetch Files Error:", err);

    res.status(500).json({
      message: "❌ Failed to fetch files",
      error: err.message,
      stack: err.stack,
    });
  }
});

module.exports = router;