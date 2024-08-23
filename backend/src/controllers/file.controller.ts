import { NextFunction, Request, Response } from "express";
import multer, { FileFilterCallback } from "multer";
import { validateBufferMIMEType } from "validate-image-type";
import sharp from "sharp";

import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import userConfig from "../db/user/user.config";

/**
 * Attach the uploaded file in the req.file object - with a buffer
 * Only images - this is for changing the user's profile picture
 */
export const uploadProfilePic = multer({
  storage: multer.memoryStorage(),
  fileFilter: async (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new AppError("Invalid file type. Only images are allowed", 400));
    } else {
      cb(null, true);
    }
  },
}).single("file");

export const resizeUserPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const validationResult = await validateBufferMIMEType(req.file.buffer, {
      allowMimeTypes: [
        "image/jpeg",
        "image/jpg",
        "image/gif",
        "image/png",
        "image/webp",
      ],
    });

    if (!validationResult.ok)
      return next(
        new AppError("Invalid file type. Only images are allowed", 400)
      );

    const compressedBuffer = await sharp(req.file.buffer)
      .resize(500, 500, { fit: "cover" })
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    // replace the current req.file object with compressed buffer's data
    req.file = {
      ...req.file,
      buffer: compressedBuffer,
      size: compressedBuffer.length,
      mimetype: "image/jpeg",
    };

    if (req.file.size > userConfig.maxProfilePictureSize)
      return next(new AppError("The file size is too large", 400));

    next();
  }
);

export const uploadPostMedia = multer({
  storage: multer.memoryStorage(),
  fileFilter: async (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new AppError("Invalid file type. Only images are allowed", 400));
    } else {
      cb(null, true);
    }
  },
}).array("media", 4);

/**
 * Processes the uploaded files
 * Only images so far, videos and gifs will be added in the future
 */
export const processPostMedia = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.files || !Array.isArray(req.files)) return next();

    // Promise.all() is there because each file is a separate promise
    const processedFiles = await Promise.all(
      req.files.map(async (file, index) => {
        const compressedBuffer = await sharp(file.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toBuffer();
        return {
          ...file,
          buffer: compressedBuffer,
        };
      })
    );

    // replace the current req.files object with compressed buffer's data
    req.files = processedFiles;
    next();
  }
);
