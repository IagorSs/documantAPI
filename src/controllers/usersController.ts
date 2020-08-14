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

  async find(req:Request, res:Response) {
    const { email } = req.body;
    const params = {
      TableName: 'users',
      Key: {
        email_id: email,
      },
    };
    try {
      this.docClient.get(params, (err, data) => {
        if (err) {
          console.log(`erro no find 1 - ${err.message}`);
          res.json({ error: err.message });
        }
        return res.json({ data });
      });
      return res.status(200);
    } catch (error) {
      console.log(`erro no find 2 - ${error.message}`);
      return res.status(404).json({ error: error.message });
    }
  }
}
