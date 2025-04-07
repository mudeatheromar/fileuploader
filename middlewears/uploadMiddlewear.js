const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // Optional folder inside Cloudinary
    allowed_formats: ['jpg', 'png', 'pdf'],
  },
});

const upload = multer({ storage });
module.exports = upload;