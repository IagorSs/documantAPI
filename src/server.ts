import Read from './read';

const read = new Read();

const express = require('express');

const app = express();

const routes = express.Router();

routes
  .get('/find_users', read.fetchOneByKey);

app.use(express.json());

app.use(routes);

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server running');
});
