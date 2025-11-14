import dotenv from "dotenv";
dotenv.config();


const env = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRESIN: process.env.JWT_EXPIRESIN,
  CLIENT_URL: process.env.CLIENT_URL,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  FROM_EMAIL: process.env.FROM_EMAIL,
  COMPANY_NAME: process.env.COMPANY_NAME,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL,
  SUBJECT: process.env.SUBJECT,
  CLOUDINARY_CONFIG_CLOUD_NAME: process.env.CLOUDINARY_CONFIG_CLOUD_NAME,
  CLOUDINARY_CONFIG_API_KEY: process.env.CLOUDINARY_CONFIG_API_KEY,
  CLOUDINARY_CONFIG_API_SECRET: process.env.CLOUDINARY_CONFIG_API_SECRET,
};

export default env;
