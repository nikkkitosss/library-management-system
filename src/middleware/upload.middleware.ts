import multer from "multer";
import { BadRequestError } from "../utils/errors";

const fileFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
    callback(new BadRequestError("Only JPEG and PNG images are allowed"));
    return;
  }

  callback(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const avatarUpload = upload.single("avatar");
