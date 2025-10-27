const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const uploadsDir = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(16).toString('hex') + ext;
    cb(null, name);
  }
});

function imageFilter(req, file, cb) {
  const ok = ['image/jpeg','image/png','image/webp','image/gif'].includes(file.mimetype);
  if (!ok) return cb(new Error('invalid file type'), false);
  cb(null, true);
}

module.exports.imageUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});