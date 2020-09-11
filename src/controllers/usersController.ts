/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import config from '../config';

const saltRounds = 10;

config();

class UsersController {
  static docClient = new AWS.DocumentClient();

  static async create(req:Request, res:Response) {
    const {
      user,
      email,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const input = {
      email_id: email,
      user,
      password: hashedPassword,
      created_on: new Date().toString(),
      updated_on: new Date().toString(),
      is_deleted: false,
    };
    const params = {
      TableName: 'users',
      Item: input,
    };
    try {
      UsersController.docClient.put(params, (err) => {
        if (err) {
          console.log(`erro - ${JSON.stringify(err, null, 2)}`);
        }
      });
      return res.status(200);
    } catch (err) {
      return res.status(400).json({ error: 'Unexpected error while creating new class' });
    }
  }

  static async find(req:Request, res:Response) {
    const { user } = req.body;
    const params = {
      TableName: 'users',
      Key: {
        user,
      },
    };
    try {
      UsersController.docClient.get(params, (err, data) => {
        if (err) {
          console.log(`erro no find 1 - ${err.message}`);
          return res.json({ error: err.message });
        }
        return res.json({ data });
      });
      return res.status(200);
    } catch (error) {
      console.log(`erro no find 2 - ${error.message}`);
      return res.status(404).json({ error: error.message });
    }
  }

  static async update(req:Request, res:Response) {
    const { oldEmail, newEmail } = req.body;
    const params = {
      TableName: 'users',
      Key: { email_id: oldEmail },
      AttributeUpdates: {
        update_by: {
          Action: 'PUT',
          Value: newEmail,
        },
      },
    };
    UsersController.docClient.update(params, (err, data) => {
      if (err) return res.json({ error: err.message });
      return res.status(200).json({ data });
    });
  }

  static async delete(req:Request, res:Response) {
    const { email } = req.body;
    const params = {
      TableName: 'users',
      Key: { email_id: email },
    };

    UsersController.docClient.delete(params, (err) => {
      if (err) return res.json({ error: err.message });
      return res.json({ message: 'user deleted successfully' });
    });
  }
}

export default UsersController;
