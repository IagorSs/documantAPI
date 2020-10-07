/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express, {
  json, Request, Response, NextFunction,
} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import AWSConfig from './config/AWS';
import corsOptions from './config/cors';
import routes from './routes';

const app = express();

AWSConfig();

app.use(cors(corsOptions));
app.use(json());
app.use(routes);
app.use(morgan('dev'));

app.use((err:any, req:Request, res:Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

const port = process.env.LOCAL_PORT || 3002;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port - ${port}`);
});
