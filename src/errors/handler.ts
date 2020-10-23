import { AWSError } from 'aws-sdk';
import { ErrorRequestHandler } from 'express';
import InternalError from './InternalError';

const errorHandler:ErrorRequestHandler = (error, req, res) => {
  console.log("Reach here?");
  switch (error.constructor.name) {
    case AWSError.constructor.name:
      res.status(error.statusCode).json({ error: error.message });
      break;
    case InternalError.constructor.name:
      res.status(error.resCode).json({ error: error.message });
      break;
    default:
      res.status(500).json({ error: "Erro inesperado do servidor" });
  }
};

export default errorHandler;
