import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

const BucketName = process.env.DOCUMANT_BUCKET_NAME || '';

async function getClient() {
  return new AWS_S3({ signatureVersion: 'v4' });
}

async function create(req:Request, res:Response) {
  const File:any = req.file;

  const S3return = {
    originalName: File.originalname,
    S3key: File.key,
    type: File.mimetype,
    size: File.size,
  };

  return res.status(200).json(S3return);
}

async function find(req:Request, res:Response) {
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

    return res.status(200).json({ tempPreviewURL: storageFile });
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.code });
  }
}

async function trueDelete(req:Request, res:Response) {
  try {
    const s3 = await getClient();

    const {
      key,
    } = req.body;

    await s3.deleteObject({
      Bucket: BucketName,
      Key: key,
    }).promise();

    return res.sendStatus(200);
  } catch (error) {
    return res.status(error.statusCode).json({ error: error.message });
  }
}

export default {
  create,
  find,
  trueDelete,
};
