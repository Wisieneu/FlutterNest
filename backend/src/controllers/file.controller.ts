import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { validateBufferMIMEType } from 'validate-image-type';
import sharp from 'sharp';

import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

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
    if (!file.mimetype.startsWith('image/')) {
      cb(new AppError('Invalid file type. Only images are allowed', 400));
    } else {
      cb(null, true);
    }
  },
}).single('file');

export const resizeUserPhoto = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    const validationResult = await validateBufferMIMEType(req.file.buffer, {
      allowMimeTypes: [
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/png',
        'image/webp',
      ],
    });

    if (!validationResult.ok)
      return next(
        new AppError('Invalid file type. Only images are allowed', 400)
      );

    req.file.filename = `user-${req.user!.username}-${
      req.user!.id
    }-pfp-${Date.now()}.jpeg`;

    const compressedBuffer = await sharp(req.file.buffer)
      .resize(500, 500, { fit: 'cover' })
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toBuffer();

    // replace the current req.file object with compressed buffer's data
    req.file = {
      ...req.file,
      buffer: compressedBuffer,
      size: compressedBuffer.length,
      mimetype: 'image/jpeg',
    };

    next();
  }
);

const postMediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/media/posts/'); // Set the destination directory
  },
  filename: function (req, file, cb) {
    cb(
      !req.user!.id
        ? new AppError('An error has occurred when uploading your file(s)', 400)
        : null,
      `${req.user!.id}-${Date.now()}-${file.originalname}`
      // file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    );
  },
});

export const uploadPostMedia = multer({
  storage: postMediaStorage,
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/')
    ) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          'Invalid file type. Only images and videos are allowed',
          400
        )
      );
    }
  },
}).array('media', 9);
