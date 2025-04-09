const express = require('express');
const router = express.Router();
const upload = require('../middlewears/uploadMiddlewear');
const { File, Folder } = require('../models');
const authenticateToken = require('../middlewears/auth');

router.post('/', authenticateToken, upload.single('file'), async (req, res) => {
  const userId = req.user.id;
  const { folderId } = req.body;
  

  try {
    // Validate folder if provided
    let folder = null;
    if (folderId) {
      folder = await Folder.findOne({ where: { id: folderId, userId } });
      if (!folder) {
        return res.status(404).json({ error: "Folder not found or doesn't belong to user" });
      }
    }

    // Save file record in DB
    const file = await File.create({
      name: req.file.originalname,
      path: req.file.path,
      userId,
      folderId: folder ? folder.id : null,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file: {
        id: file.id,
        name: file.name,
        folderId: file.folderId,
        path: file.path,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload file" });
  }
});

module.exports = router;