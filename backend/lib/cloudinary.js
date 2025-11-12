import { v2 as cloudinary } from "cloudinary";
import env from "./env.js";


cloudinary.config({
  cloud_name: env.CLOUDINARY_CONFIG_CLOUD_NAME,
  api_key: env.CLOUDINARY_CONFIG_API_KEY,
  api_secret: env.CLOUDINARY_CONFIG_API_SECRET,
  secure: true,
});

export default cloudinary;