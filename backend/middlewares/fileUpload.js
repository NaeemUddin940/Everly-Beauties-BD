import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { MainCategory } from "../models/category.model.js";

export const uploadTo = (folderName) => {
  if (!folderName) {
    throw new Error("Folder name is required!");
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const base = "./uploads";
      const fullPath = path.join(base, folderName);

      // create folder if not exists
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }

      cb(null, fullPath);
    },

    filename: (req, file, cb) => {
      const uniqueName =
        crypto.randomBytes(5).toString("hex") + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

  // 🛑 IMPORTANT: Prevent upload if title already exists
  const fileFilter = async (req, file, cb) => {
    const exists = await MainCategory.findOne({ title: req.body.title });

    if (exists) {
      return cb(new Error(`Category '${req.body.title}' already exists`));
    }

    cb(null, true);
  };

  return multer({ storage, fileFilter });
};
