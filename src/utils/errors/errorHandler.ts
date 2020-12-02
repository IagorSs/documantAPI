import { AWSError } from 'aws-sdk';
import { ErrorRequestHandler } from 'express';
import { MulterError } from 'multer';
import APIError, { InternalServerError } from './APIErrors';
import { errorCodes } from '../httpCodes';

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
  // if (error instanceof AWSError) return res.status(error.statusCode).json({ error: error.message });

  if (error instanceof APIError) return res.status(error.httpCode).json({ error: error.message });

  if (error instanceof MulterError) return res.status(errorCodes.BAD_REQUEST).json({ error: `Error with file - ${error.message}` });

  console.error(error.message);
  const defaultError = new InternalServerError();

  return res.status(defaultError.httpCode).json({ error: defaultError.message });
};

export default errorHandler;
