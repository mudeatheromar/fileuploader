const express = require('express');
const router = express.Router();
const upload = require('../middlewears/uploadMiddlewear');

router.post('/', upload.single('file'), (req, res) => {
  res.json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

module.exports = router;
