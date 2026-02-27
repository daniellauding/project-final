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

    return {
      folder: "designvote",
      resource_type: isVideo ? "video" : isAudio ? "video" : "image",
      allowed_formats: [
        "jpg", "jpeg", "png", "gif", "webp", "svg",
        "mp4", "mov", "webm", "avi",
        "mp3", "wav", "ogg", "m4a",
      ],
      transformation: isVideo || isAudio ? [] : [{ width: 1200, crop: "limit" }],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB for video
});

export default upload;
