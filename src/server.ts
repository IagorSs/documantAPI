import express from 'express';
import Read from './read';
import filesController, {} from './controllers/filesController';

const app = express();
const routes = express.Router();

app.use(express.json());
app.use(routes);

const read = new Read();

routes
  .get('/find_users', read.fetchOneByKey)
  .get('/files', filesController.getFile);

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server running');
});
