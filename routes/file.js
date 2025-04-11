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

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const file = await File.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!file) {
      return res.status(404).json({ message: "❌ File not found" });
    }

    await file.destroy();

    res.status(200).json({ message: "✅ File deleted successfully" });
  } catch (err) {
    console.error("Delete File Error:", err);
    res.status(500).json({
      message: "❌ Failed to delete file",
      error: err.message,
      stack: err.stack,
    });
  }
});


router.put("/:id/move", authenticate, async (req, res) => {
  const { id } = req.params;
  const { targetFolderId } = req.body;
  const userId = req.user.id;

  try {
    const file = await File.findOne({ where: { id, userId } });

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    file.folderId = targetFolderId || null;
    await file.save();

    res.json({ message: "✅ File moved successfully", file });
  } catch (err) {
    console.error("Error moving file:", err);
    res.status(500).json({ error: "❌ Failed to move file", details: err.message });
  }
});

module.exports = router;