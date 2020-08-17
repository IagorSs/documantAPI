import express from 'express';
import UsersController from './controllers/usersController';
import filesController, {} from './controllers/filesController';

const app = express();
const routes = express.Router();

app.use(express.json());
app.use(routes);

routes
  .get('/users', UsersController.find)
  .post('/users', UsersController.create)
  .put('/users', UsersController.update)
  .delete('/users', UsersController.delete);
// .get('/find_users', read.fetchOneByKey)
// .get('/files', filesController.getFile);

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server running');
});
