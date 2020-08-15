import AWS_S3 from 'aws-sdk/clients/s3';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import Config from '../config';

export default class filesController {
  static async getFile(req:Request, res:Response) {
    try {
      Config.configS3();
      const s3 = new AWS_S3();
      const response = await s3.listObjectsV2({
        Bucket: 'liveteste',
      }).promise();

      return res.json(response);
    } catch (error) {
      return res.json(error);
    }
  }
}
