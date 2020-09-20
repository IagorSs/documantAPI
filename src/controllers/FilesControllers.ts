import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

export class FilesController {
  static async getClient() {
    return new AWS_S3();
  }

  static async uploadFile(req:Request, res:Response) {
    const File = req.file;

    return res.json({
      originalName: File.originalname,
      type: File.mimetype,
      size: File.size,
      key: File.key,
      location: File.location,
    });
  }

  static async getFileStorage(Bucket:string, Key:string) {
    const s3 = await FilesController.getClient();

    return s3.getObject({ Bucket, Key });
  }

  static async getFile(req:Request, res:Response) {
    try {
      const { Bucket, Key } = req.body;

      const storageFile = await FilesController.getFileStorage(Bucket, Key);

      res.sendStatus(200);

      console.log(storageFile);
      return storageFile;
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default FilesController;
