/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

async function authenticate(req:Request, res:Response, next:NextFunction) {
  try {
    const token = req.headers.authorization;

    if (token === undefined) {
      throw {
        statusCode: 401,
        message: `token can't be null`,
      };
    }

    if (!token) {
      throw {
        statusCode: 204,
        message: `token can't be null`,
      };
    }

    const jwtVerify = new Promise<void>((resolve) => {
      jwt.verify(token, authConfig.secret, (err, user) => {
        if (err) {
          throw {
            statusCode: 401,
            message: 'error while authenticating the token',
          };
        }
        req.body.user = user;
        resolve();
      });
    });

    await jwtVerify;

    next();
  } catch (err) {
    res.status(err.statusCode).json({ error: err.message });
  }
}

export default authenticate;
