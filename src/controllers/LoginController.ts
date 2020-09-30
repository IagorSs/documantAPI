import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import User from './UsersControllers';
import auth from '../config/auth';
import TokenController from './TokenController';

class Login {
  static async login(req:Request, res:Response) {
    const { email, password } = req.body;

    try {
      const user = await User.getItem(email);

      // WTF this user.message?
      if (user.message !== undefined) {
        throw {
          statusCode: 404,
          message: user.message,
        };
        // return res.status(404).json({ error: user.message });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        throw {
          statusCode: 401,
          message: 'invalid password',
        };
      }

      const userForToken = {
        username: email,
        id: 0, /* algum id q a gente tem q definir pra cada user
        (caso ache desnecessário, só tirar a chave id do json) */
      };

      const accessToken = jwt.sign(userForToken, auth.secret, { expiresIn: auth.expire });

      const refreshToken = jwt.sign(userForToken, auth.refreshSecret);

      await TokenController.insertToken(refreshToken);

      return res.status(200).json({ accessToken, refreshToken });
    } catch (error) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  }

  static async logout(req:Request, res:Response) {
    try {
      const { token } = req.body;

      if (!token) {
        throw {
          statusCode: 400,
          message: `token can't be null`,
        };
      }

      await TokenController.deleteToken(token);

      return res.sendStatus(200);
    } catch (err) {
      return res.status(err.statusCode).json({ error: err.message });
    }
  }
}

export default Login;
