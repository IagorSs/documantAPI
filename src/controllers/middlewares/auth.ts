/* eslint-disable no-unused-vars */
import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import Request from '../../interfaces/IRequest';
import authConfig from '../../config/auth';

// eslint-disable-next-line consistent-return
function authenticate(req:Request, res:Response, next:NextFunction) {
  const { token } = req.headers.authorization;
  if (token === undefined) {
    // eslint-disable-next-line quotes
    return res.status(401).json({ error: `token can't be null` });
  }
  if (!token) {
    // eslint-disable-next-line quotes
    return res.status(204).json({ error: `token can't be null` });
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, authConfig.secret, (err, user) => {
    if (err) {
      return res.status(401).json({ error: 'error while authenticating the token' });
    }
    req.user = user;
    next();
  });
}

export default authenticate;
