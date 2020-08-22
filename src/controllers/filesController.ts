import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import FileSystem from 'fs';

export default class filesController {
  static async getClient() {
    // Config.configS3();
    return new AWS_S3();
  }

  static async getFileStorage(Bucket:string, Key:string) {
    const s3 = await this.getClient();

    const params = { Bucket, Key };

    return s3.getObject(params);
  }

  static async getExampleFE(req:Request, res:Response) {
    try {
      const { Bucket, Key, fileLocation } = req.body;

      const fileCompleteLocation = `${fileLocation}${Key}`;
      const file = FileSystem.createWriteStream(fileCompleteLocation);
      const storageFile = await this.getFileStorage(Bucket, Key);

      storageFile.createReadStream().pipe(file);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  static async getFile(req:Request, res:Response) {
    try {
      const s3 = await this.getClient();

      const { Bucket, Key } = req.body;

      const params = { Bucket, Key };

      res.sendStatus(200);
      return s3.getObject(params);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
