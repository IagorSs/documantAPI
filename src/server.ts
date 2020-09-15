import express from 'express';
import UsersController from './controllers/usersController';
import filesController, {} from './controllers/filesController';
import Config from './config';
import LoginController from './controllers/loginController';

const app = express();
const routes = express.Router();

Config.index();

app.use(express.json());
app.use(routes);

routes
  .get('/users', UsersController.find)
  .post('/users', UsersController.create)
  .put('/users', UsersController.update)
  .delete('/users', UsersController.delete)

  .get('/login', LoginController.login)

  .get('/files', filesController.getFile)

  .get('/exampleTeste', filesController.getExampleFE);

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server running');
});
