import express, { json } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { config } from 'dotenv';
import AWSConfig from './config/AWS';
import routes from './routes';

config();

const app = express();

AWSConfig();

app.use(cors());
app.use(json());
app.use(routes);
app.use(morgan('dev'));

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server running');
});
