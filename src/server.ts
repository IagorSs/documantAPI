import express from 'express';
import UsersController from './controllers/usersController';

const app = express();
const routes = express.Router();

app.use(express.json());
app.use(routes);

routes
  .get('/find_users', UsersController.find)
  .post('/create_user', UsersController.create)
  .put('/update_user', UsersController.update)
  .delete('/delete_user', UsersController.delete);

app.listen(8000, () => {
  // eslint-disable-next-line no-console
  console.log('server running');
});
