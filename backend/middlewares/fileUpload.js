import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";

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

  return multer({ storage });
};

// Special uploader for variable product fields: places files into
// different folders depending on the field name.
export const uploadVariableProduct = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const base = "./uploads";
      let folder = "others";

      if (file.fieldname === "mainImage") {
        folder = "variableProductImage";
      } else if (file.fieldname === "galleryImages") {
        folder = "variableProductImages";
      } else if (
        file.fieldname &&
        (file.fieldname.startsWith("variationImage") ||
          file.fieldname.startsWith("variationImages"))
      ) {
        folder = "variableProductVariation";
      }

      const fullPath = path.join(base, folder);

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

  return multer({ storage });
};
