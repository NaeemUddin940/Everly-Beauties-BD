import dotenv from "dotenv";
dotenv.config();
const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME,
  CLIENT_URL: process.env.CLIENT_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SUBJECT: process.env.SUBJECT,
  CLOUDINARY_CONFIG_CLOUD_NAME: process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  CLOUDINARY_CONFIG_API_KEY: process.env.CLOUDINARY_CONFIG_API_KEY,
  CLOUDINARY_CONFIG_API_SECRET: process.env.CLOUDINARY_CONFIG_API_SECRET,
  ARCJET_API_KEY: process.env.ARCJET_API_KEY,
  ARCJET_ENV: process.env.ARCJET_ENV,
};

export default env;