import { FileFilterCallback } from 'multer';
import crypto from 'crypto';
import { Request } from 'express';
import multerS3 from 'multer-s3';
import AWS from 'aws-sdk';
import { BadRequestError } from '../utils/errors/APIErrors';

export default {
  storage: multerS3({
    s3: new AWS.S3(),
    bucket: process.env.DOCUMANT_BUCKET_NAME || '',
    contentType: multerS3.DEFAULT_CONTENT_TYPE,
    acl: 'public-read',
    key: (
      req:Request,
      file:Express.Multer.File,
      cb:(error: Error | null, filename?: string) => void,
    ) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname.replace(/\s+/g, '')}`;

        cb(null, fileName);
      });
    },
  }),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_TAM || '0', 10), // MAX_SIZE == 2MB
  },
  fileFilter: (req:Request, file:Express.Multer.File, cb:FileFilterCallback) => {
    const allowedMimes = [
      // PDF
      'application/pdf',

      // DOCX
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new BadRequestError(`Invalid file type of file (${file.mimetype})`));
  },
};
