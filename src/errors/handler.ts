import { AWSError } from 'aws-sdk';
import { ErrorRequestHandler } from 'express';
import InternalError from './InternalError';

const errorHandler:ErrorRequestHandler = (error, req, res) => {
  console.log("Reach here?");
  if (error instanceof AWSError) res.status(error.statusCode).json({ error: error.message });
  else if (error instanceof InternalError) res.status(error.resCode).json({ error: error.message });
  else res.status(500).json({ error: "Erro inesperado do servidor" });
};

export default errorHandler;
