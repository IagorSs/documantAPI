import { AWSError } from 'aws-sdk';
import { ErrorRequestHandler } from 'express';

const errorHandler:ErrorRequestHandler = (error, req, res) => {
  switch (error) {
    case AWSError:
      res.status(error.statusCode).json({ error: error.message });
      break;
    default:
      res.status(500).json({ error: "Erro inesperado do servidor" });
  }
};

export default errorHandler;
