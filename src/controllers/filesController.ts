import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import FileSystem from 'fs';

export default class filesController {
  static async getClient() {
    return new AWS_S3();
  }

  static async getFileStorage(Bucket:string, Key:string) {
    const s3 = await filesController.getClient();

    return s3.getObject({ Bucket, Key });
  }

  static async getExampleFE(req:Request, res:Response) {
    let errorHandling;
    try {
      const { Bucket, Key /* fileLocation */ } = req.body;

      const fileLocation = './src/temp/';

      const fileCompleteLocation = `${fileLocation}${Key}`;

      errorHandling = 'Cannot found fileLocation';
      const file = FileSystem.createWriteStream(fileCompleteLocation);

      errorHandling = 'Cannot get File from storage';
      const storageFile = await filesController.getFileStorage(Bucket, Key);

      errorHandling = 'Cannot write correctly file';
      storageFile.createReadStream().pipe(file);

      errorHandling = 'Cannot return response';
      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
      return res.status(500).send(errorHandling);
    }
  }

  static async getFile(req:Request, res:Response) {
    try {
      const { Bucket, Key } = req.body;

      const storageFile = await filesController.getFileStorage(Bucket, Key);

      res.sendStatus(200);

      return storageFile;
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
