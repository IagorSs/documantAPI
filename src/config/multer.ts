// eslint-disable-next-line no-unused-vars
import { FileFilterCallback } from 'multer';
import crypto from 'crypto';
// eslint-disable-next-line no-unused-vars
import { Request } from 'express';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';

export default {
  storage: multerS3({
    s3: new AWS.S3(),
    // s3: new AWS_S3(),
    bucket: 'documant',
    contentType: multerS3.DEFAULT_CONTENT_TYPE,
    acl: 'public-read',
    key: (
      req:Request,
      file:Express.Multer.File,
      cb:(error: Error | null, filename: string) => void,
    ) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, '');

        const fileName = `${hash.toString('hex')}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }),
  limits: {
    fileSize: 2 * 1024 * 1024, // MAX_SIZE == 2MB
  },
  fileFilter: (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'application/pdf',
    ];

    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Invalid file type - ${file.mimetype}`));
  },
};
