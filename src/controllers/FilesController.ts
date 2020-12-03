import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import { successfulCodes } from '../utils/httpCodes';
import {} from '../utils/errors/APIErrors';

const BucketName = process.env.DOCUMANT_BUCKET_NAME || '';

async function getClient() {
  return new AWS_S3({ signatureVersion: 'v4' });
}

async function postRoute(req:Request, res:Response) {
  const File:any = req.file;

  const S3return = {
    id: File.key,
    title: File.originalname,
    type: File.mimetype,
    size: File.size,
  };

  return res.status(successfulCodes.CREATED).json(S3return);
}

async function getRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const s3 = await getClient();

    const { id } = req.params;
    const Bucket = BucketName;

    await s3.headObject({ Bucket, Key: id }).promise();

    const storageFile = s3.getSignedUrl('getObject', {
      Bucket,
      Key: id,
      Expires: parseInt(process.env.FILE_EXPIRE || '', 10),
    });

    return res
      .status(successfulCodes.IM_USED)
      .json({
        tempPreviewURL: storageFile,
        message: `Essa URL ira expirar em ${process.env.FILE_EXPIRE} segundos`,
      });
  } catch (error) {
    next(error);
  }
}

export async function deleteFile(id:string) {
  const s3 = await getClient();

  await s3.deleteObject({
    Bucket: BucketName,
    Key: id,
  }).promise();
}

async function deleteRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const {
      id,
    } = req.params;

    deleteFile(id);

    return res.sendStatus(successfulCodes.ACCEPTED);
  } catch (error) {
    next(error);
  }
}

export default {
  postRoute,
  getRoute,
  deleteRoute,
};
