const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const imagesDir = path.join(__dirname, '..', 'images');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, imagesDir); },
  filename: function (req, file, cb) {
    const safe = Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, safe);
  }
});

const upload = multer({ storage });

// POST /api/upload - expects field 'image' - returns { imageUrl }
router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const imageUrl = '/images/' + req.file.filename;
  res.json({ imageUrl });
});

module.exports = router;
