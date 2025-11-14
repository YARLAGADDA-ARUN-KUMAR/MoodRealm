import express from "express";
import multer from "multer";
import { uploadImage } from "../controllers/uploadController.js";
import protect from "../middleware/authMiddleware.js";

const uploadRoutes = express.Router();

const storage = multer.memoryStorage();
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed"));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 3 * 1024 * 1024, // 3MB
    },
    fileFilter,
});

uploadRoutes.post("/image", protect, upload.single("image"), uploadImage);

uploadRoutes.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: err.message });
    }

    if (err) {
        return res.status(400).json({ message: err.message });
    }

    next();
});

export default uploadRoutes;

