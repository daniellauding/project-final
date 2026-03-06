import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    const isAudio = file.mimetype.startsWith("audio/");
    const isImage = file.mimetype.startsWith("image/");

    const resourceType = isVideo || isAudio ? "video" : isImage ? "image" : "raw";
    const transform = isImage ? [{ width: 2400, crop: "limit" }] : [];

    return {
      folder: "pejla",
      resource_type: resourceType,
      allowed_formats: [
        "jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff", "ico", "heic", "heif", "avif",
        "mp4", "mov", "webm", "avi", "mkv", "m4v",
        "mp3", "wav", "ogg", "m4a", "flac", "aac",
        "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx",
        "md", "txt", "csv", "json", "html", "css", "js", "ts", "jsx", "tsx",
        "zip", "sketch", "fig",
      ],
      transformation: transform,
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
});

export default upload;
