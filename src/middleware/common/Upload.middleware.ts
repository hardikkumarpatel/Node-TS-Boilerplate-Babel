import multer, { MulterError } from "multer";
import path from "node:path";
import fs from "node:fs";

type Callback = (error: Error | null, filename: string) => void;
class UploadMiddleware {
  private static MAX_SIZE = 1 * 1000 * 1000; /** 1MB */
  private static storage = multer.diskStorage({
    destination(_req, file: Express.Multer.File, callback: Callback) {
      const folder = file.mimetype.startsWith("image/") ? "image" : "pdf";
      const location = path.resolve("src", "upload", folder);
      if (!fs.existsSync(location)) {
        fs.mkdirSync(location, { recursive: true });
      }
      callback(null, location);
    },
    filename(_req, file: Express.Multer.File, callback: Callback) {
      callback(null, Date.now() + "-" + file.originalname);
    }
  });

  private static filter = (
    _req: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
  ) => {
    const types = ["image/jpeg", "image/png", "image/gif", "application/pdf"];
    if (types.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(
        new MulterError(
          "INVALID_FILE_TYPE" as any,
          "Invalid file type. Only images and PDFs are allowed"
        )
      );
    }
  };

  public static upload = multer({
    storage: this.storage,
    limits: {
      fileSize: this.MAX_SIZE
    },
    fileFilter: this.filter as unknown as any
  });
}

export default UploadMiddleware;
