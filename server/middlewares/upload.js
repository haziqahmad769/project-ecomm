import multer from "multer";
import path from "path";
import crypto from "crypto";

const uploadPath = "uploads"; // Use the Render-mounted directory

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uuid = crypto.randomUUID();
    cb(null, uuid + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

export default upload;