import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import { successfulCodes } from '../utils/httpCodes';
import {} from '../utils/errors/APIErrors';

const BucketName = process.env.DOCUMANT_BUCKET_NAME || '';

async function getClient() {
  return new AWS_S3({ signatureVersion: 'v4' });
}

async function createFileOnSave(File:Express.Multer.File) {
  const S3return = {
    originalName: File.originalname,
    S3key: File.key,
    type: File.mimetype,
    size: File.size,
  };

  return S3return;
}

async function create(req:Request, res:Response) {
  const File:any = req.file;

  const S3return = {
    originalName: File.originalname,
    S3key: File.key,
    type: File.mimetype,
    size: File.size,
  };

  return res.status(successfulCodes.CREATED).json(S3return);
}

async function find(req:Request, res:Response, next:NextFunction) {
  try {
    const s3 = await getClient();

    const { key } = req.body;
    const Bucket = BucketName;

    await s3.headObject({ Bucket, Key: key }).promise();

    const storageFile = s3.getSignedUrl('getObject', {
      Bucket,
      Key: key,
      Expires: 60,
    });

    return res.status(successfulCodes.IM_USED).json({ tempPreviewURL: storageFile });
  } catch (error) {
    next(error);
  }
}

async function trueDelete(req:Request, res:Response, next:NextFunction) {
  try {
    const s3 = await getClient();

    const {
      key,
    } = req.body;

    await s3.deleteObject({
      Bucket: BucketName,
      Key: key,
    }).promise();

    return res.sendStatus(successfulCodes.ACCEPTED);
  } catch (error) {
    next(error);
  }
}

export default {
  create,
  find,
  trueDelete,
};
