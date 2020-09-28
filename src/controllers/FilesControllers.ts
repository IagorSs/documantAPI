import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

export default class FilesController {
  static async getClient() {
    return new AWS_S3({ signatureVersion: 'v4' });
  }

  static async create(req:Request, res:Response) {
    const File:any = req.file;

    return res.status(200).json({
      originalName: File.originalname,
      type: File.mimetype,
      size: File.size,
      S3key: File.key,
      URLDownload: File.location,
    });
  }

  static async find(req:Request, res:Response) {
    try {
      const s3 = await FilesController.getClient();

      const { key } = req.body;
      const Bucket = process.env.DOCUMANT_BUCKET_NAME || '';

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

  static async delete(req:Request, res:Response) {
    try {
      const s3 = await FilesController.getClient();

      const {
        key,
      } = req.body;

      await s3.deleteObject({
        Bucket: process.env.DOCUMANT_BUCKET_NAME || '',
        Key: key,
      }).promise();

      return res.sendStatus(200);
    } catch (error) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  }
}
