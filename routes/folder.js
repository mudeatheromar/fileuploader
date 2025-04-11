const express = require("express");
const router = express.Router();
const { Folder, File } = require("../models");
const authenticateToken = require("../middlewears/auth");

router.use(authenticateToken);

// POST /api/folders - Create a folder (support nested folders)
router.post("/", async (req, res) => {
  const { name, parentFolderId } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: "Folder name is required." });
  }

  try {
    const folder = await Folder.create({ name, userId, parentFolderId });
    res.status(201).json(folder);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to create folder", details: err.message });
  }
});

// GET /api/folders - Get all root folders for a user (no parent)
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const folders = await Folder.findAll({
      where: {
        userId,
        parentFolderId: null,
      },
      include: [{
        model: File,
        as: "files",
        where: { folderId: null },
        required: false,
      }],
    });

    res.json(folders);
  } catch (err) {
    console.error("Error fetching folders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/folders/:id - Get folder details with files & subfolders
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const folder = await Folder.findOne({
      where: { id, userId },
      include: [
        { model: File, as: "files" },
        { model: Folder, as: "subfolders" },
      ],
    });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.json({
      folder,
      files: folder.files,
      subfolders: folder.subfolders,
    });
  } catch (err) {
    console.error("Error fetching folder with files:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const folder = await Folder.findOne({ where: { id, userId } });
    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    // Recursive delete function
    const deleteFolderContents = async (folderId) => {
      const subfolders = await Folder.findAll({ where: { parentFolderId: folderId } });

      for (const sub of subfolders) {
        await deleteFolderContents(sub.id);
      }

      await File.destroy({ where: { folderId } });
      await Folder.destroy({ where: { id: folderId } });
    };

    await deleteFolderContents(id);
    res.json({ message: "Folder and contents deleted successfully" });
  } catch (err) {
    console.error("Error deleting folder:", err);
    res.status(500).json({ error: "Failed to delete folder", details: err.message });
  }
});
router.put("/:id/move", async (req, res) => {
  const { id } = req.params;
  const { parentFolderId } = req.body;
  const userId = req.user.id;

  try {
    const folder = await Folder.findOne({ where: { id, userId } });

    if (!folder) {
      return res.status(404).json({ error: "Folder not found" });
    }

    if (id === parentFolderId) {
      return res.status(400).json({ error: "A folder cannot be moved into itself." });
    }

    // ✅ Check if the new parent folder exists and belongs to the same user
    if (parentFolderId) {
      const newParent = await Folder.findOne({ where: { id: parentFolderId, userId } });

      if (!newParent) {
        return res.status(400).json({ error: "Target parent folder not found or not owned by the user." });
      }
    }

    folder.parentFolderId = parentFolderId || null;
    await folder.save();

    res.json({ message: "✅ Folder moved successfully", folder });
  } catch (err) {
    console.error("Error moving folder:", err);
    res.status(500).json({ error: "❌ Failed to move folder", details: err.message });
  }
});



module.exports = router;
