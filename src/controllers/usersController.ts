/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';

class UsersController {
  static async getClient() {
    return new AWS.DocumentClient();
  }

  static async create(req:Request, res:Response) {
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
      const docClient = await this.getClient();

      return docClient.put(params, (err, data) => {
        if (err) {
          console.log(`erro - ${JSON.stringify(err, null, 2)}`);
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async find(req:Request, res:Response) {
    const { email } = req.body;

    const params = {
      TableName: 'users',
      Key: {
        email_id: email,
      },
    };

    try {
      const docClient = await this.getClient();

      return docClient.get(params, (err, data) => {
        if (err) {
          console.log(`erro no find 1 - ${err.message}`);
          return res.status(500).json({ error: err.message });
        }
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async update(req:Request, res:Response) {
    const { oldEmail, newEmail } = req.body;
    const params = {
      TableName: 'users',
      Key: { email_id: oldEmail },
      AttributeUpdates: {
        newEmail: {
          Action: 'PUT',
          Value: newEmail,
        },
      },
    };
    try {
      const docClient = await this.getClient();

      return docClient.update(params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.status(200).json(data);
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  static async delete(req:Request, res:Response) {
    const { email } = req.body;
    const params = {
      TableName: 'users',
      Key: { email_id: email },
    };

    try {
      const docClient = await this.getClient();

      return docClient.delete(params, (err) => {
        if (err) return res.send(500).json({ error: err.message });
        return res.send(200).json({ message: 'user deleted successfully' });
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default UsersController;
