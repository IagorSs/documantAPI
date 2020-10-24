import { AWSError } from 'aws-sdk';
import { ErrorRequestHandler } from 'express';
import APIErro, { InternalServerError } from './APIErrors';

const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AWSError) return res.status(error.statusCode).json({ error: error.message });

  if (error instanceof APIErro) return res.status(error.httpCode).json({ error: error.message });

  const auxErro = new InternalServerError();

  return res.status(auxErro.httpCode).json({ error: auxErro.message });
};

export default errorHandler;
