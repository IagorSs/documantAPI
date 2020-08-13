// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';

export default class UsersController {
  docClient = new AWS.DocumentClient();

  async create(req:Request, res:Response) {
    const {
      email,
    } = req.body;

    const input = {
      email_id: email,
      created_on: new Date().toString(),
      updated_on: new Date().toString(),
      is_deleted: false,
    };

    const params = {
      TableName: 'users',
      Item: input,
    };

    try {
      this.docClient.put(params, (err) => {
        if (err) {
          console.log(`erro - ${JSON.stringify(err, null, 2)}`);
        }
      });
      return res.status(200);
    } catch (err) {
      return res.status(400).json({ error: 'Unexpected error while creating new class' });
    }
  }
}
