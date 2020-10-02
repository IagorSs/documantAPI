import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import User from './UsersControllers';
import auth from '../config/auth';
import TokenController from './TokenController';

class Login {
  static checkSecretJWTEnv() {
    if (!process.env.AUTH_SECRET || !process.env.AUTH_REFRESH_SECRET) {
      throw {
        statusCode: 500,
        message: 'JWT secret not setted',
      };
    }

    if (!process.env.AUTH_EXPIRE) {
      throw {
        statusCode: 500,
        message: 'JWT without expires',
      };
    }
  }

  static async login(req:Request, res:Response) {
    const { email, password } = req.body;

    try {
      const user = await User.getItem(email);

      const match = await bcrypt.compare(password, user.password);

      if (match) {
        Login.checkSecretJWTEnv();

        const accessToken = jwt.sign(email, auth.secret, { expiresIn: auth.expire });

        const refreshToken = jwt.sign(email, auth.refreshSecret);

        await TokenController.insertToken({ tokenId: accessToken, refreshToken });

        return res.status(200).json({ accessToken });
      }

      throw {
        statusCode: 401,
        message: 'invalid password',
      };
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
