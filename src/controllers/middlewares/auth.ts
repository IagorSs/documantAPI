/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';
import { BadRequestError, UnauthenticatedError } from '../../utils/errors/APIErrors';

async function authenticate(req:Request, res:Response, next:NextFunction) {
  try {
    const token = req.headers.authorization;

    if (token) {
      const jwtVerify = new Promise<void>((resolve) => {
        jwt.verify(token, authConfig.secret, (err, email) => {
          if (!err) {
            req.body.email = email;

            return resolve();
          }
          throw new UnauthenticatedError();
        });
      });

      return await jwtVerify;
    }
    throw new BadRequestError("Token can't be null");
  } catch (err) {
    next(err);
  }
}

export default authenticate;
