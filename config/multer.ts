import { Request } from "express";
import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req: Request, file: any, cb: any) {
    cb(null, "uploads");
  },
  filename: function (req: Request, file: any, cb: any) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  cb(null, file.fieldname + "-" + uniqueSuffix + ".jpg");
  },
});

const upload = multer({
  storage: storage,
  fileFilter: async function (req: any, file: any, callback: any) {
    var ext: any = file.mimetype;

    if (
      ext !== "image/jpeg" &&
      ext !== "image/jpg" &&
      ext !== "image/gif" &&
      ext !== "image/png"
    ) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },

  limits: { fileSize: 100000 },
}).single("image");


export default upload;
