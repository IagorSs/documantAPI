import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from './UsersControllers';
import auth from '../config/auth';
import TokenController from './TokenController';

async function login(req:Request, res:Response, next: NextFunction) {
  const { email, password } = req.body;

  try {
    const user = await User.getItem(email);

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const accessToken = jwt.sign({ email }, auth.secret, { expiresIn: auth.expire });

      // const refreshToken = jwt.sign(email, auth.refreshSecret);

      // await TokenController.insertToken({ tokenID: accessToken, refreshToken });

      return res.status(200).json({ accessToken });
    }

    throw {
      statusCode: 401,
      message: 'invalid password',
    };
  } catch (error) {
    return next(error);
  }
}

async function logout(req:Request, res:Response, next: NextFunction) {
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
  } catch (error) {
    return next(error);
  }
}

export default {
  login,
  logout,
};
