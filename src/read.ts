// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import Config from './config';

export default class Read {
  async fetchOneByKey(req:Request, res:Response) {
    Config.configDynamo();
    const docClient = new AWS.DocumentClient();
    const { email } = req.body;
    const params = {
      TableName: 'users',
      Key: {
        email_id: email,
      },
    };
    docClient.get(params, (err, data) => {
      if (err) {
        console.log(`users::fetchOneByKey::error - ${JSON.stringify(err, null, 2)}`);
        return res.json({ status: 'deu errado' });
      }
      console.log(`users::fetchOneByKey::sucess - ${JSON.stringify(data, null, 2)}`);
      return res.json({ data });
    });
  }
}
