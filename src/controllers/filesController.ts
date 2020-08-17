import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import Config from '../config';

export default class filesController {
  static async getClient() {
    Config.configS3();
    return new AWS_S3();
  }

  static async getFile(req:Request, res:Response) {
    const {
      Bucket,
    } = req.body;
    try {
      const s3 = await filesController.getClient();
      const response = await s3.listObjectsV2({
        Bucket,
      }).promise();

      return response ? res.status(200).json(response) : res.sendStatus(500);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}
