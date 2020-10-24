import jwt from 'jsonwebtoken';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from './UsersControllers';
import auth from '../config/auth';
import TokenController from './TokenController';
import { successfulCodes } from '../utils/httpCodes';
import { BadRequestError, ForbiddenError } from '../utils/errors/APIErrors';

async function login(req:Request, res:Response, next: NextFunction) {
  const { email, password } = req.body;

  try {
    const user = await User.getItem(email);

    const match = await bcrypt.compare(password, user.password);

    if (match) {
      const accessToken = jwt.sign({ email }, auth.secret, { expiresIn: auth.expire });

      // const refreshToken = jwt.sign(email, auth.refreshSecret);

      // await TokenController.insertToken({ tokenID: accessToken, refreshToken });

      return res.status(successfulCodes.IM_USED).json({ accessToken });
    }

    throw new ForbiddenError();
  } catch (error) {
    next(error);
  }
}

async function logout(req:Request, res:Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;

    if (token) {
      await TokenController.deleteToken(token);

      res.sendStatus(successfulCodes.OK);
    }

    throw new BadRequestError("Token can't be null");
  } catch (error) {
    next(error);
  }
}

export default {
  login,
  logout,
};
