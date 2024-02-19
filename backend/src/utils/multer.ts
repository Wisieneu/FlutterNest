import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import AppError from './appError';

const profilePictureStorage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb) {
    cb(null, 'public/media/users/'); // Set the destination directory
  },
  filename: function (req, file, cb) {
    const fileName = `pfp-${req.user!.username}-${Date.now()}.jpg`;
    cb(null, `${fileName}`);
  },
});

const postMediaStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/media/posts/'); // Set the destination directory
  },
  filename: function (req, file, cb) {
    console.log(req.body);
    console.log(req.files);
    cb(
      !req.user!.id
        ? new AppError('An error has occurred when uploading your file(s)', 400)
        : null,
      `${req.user!.id}-${Date.now()}-${file.originalname}`
      // file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    ); // Set the file name
  },
});

export const uploadProfilePic = multer({
  storage: profilePictureStorage,
}).single('image');

export const uploadPostMedia = multer({
  storage: postMediaStorage,
  fileFilter: (req, file, cb) => {
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
