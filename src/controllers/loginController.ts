// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import UsersController from './usersController';

class Login {
  static async getClient() {
    return new AWS.DocumentClient();
  }

  static async login(req:Request, res:Response) {
    const { username, password } = req.body;
    try {
      const user = UsersController.find(username);
      if (user.error) {
        return res.status(404).json({ error: 'user not found' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: 'wrong password' });
      }
    } catch (error) {
      /* todo */
    }
  }

  static async logout(req:Request, res:Response) {
    /* todo */
  }
}

export default Login;
