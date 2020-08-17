import express from 'express';
import UsersController from './controllers/usersController';

const app = express();
const routes = express.Router();

app.use(express.json());
app.use(routes);

routes
  .get('/users', UsersController.find)
  .post('/users', UsersController.create)
  .put('/users', UsersController.update)
  .delete('/users', UsersController.delete);

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server running');
});
