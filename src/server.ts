/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import express, {
  json,
} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import AWSConfig from './config/AWS';
import corsOptions from './config/cors';
import routes from './routes';
import errorHandler from './utils/errors/errorHandler';
import checkENV from './utils/checkENV';

const app = express();

app.use(json());
app.use(morgan('dev'));

checkENV();
AWSConfig();

app.use(cors(corsOptions));

app.use(routes);
app.use(errorHandler);

const port = parseInt(process.env.LOCAL_PORT || '3002', 10);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port - ${port}`);
});
