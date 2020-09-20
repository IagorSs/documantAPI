import { Router } from 'express';
import multer from 'multer';
import UsersController from './controllers/usersController';
import { FilesController } from './controllers/FilesController';
import LoginController from './controllers/loginController';
import MultConfig from './config/multer';

const routes = Router();

routes
  .get('/users', UsersController.find)
  .post('/users', UsersController.create)
  .put('/users', UsersController.update)
  .delete('/users', UsersController.delete)

  .get('/login', LoginController.login)

  .get('/files', FilesController.getFile)

  .post('/post-file', multer(MultConfig).single('file'), FilesController.uploadFile);

export default routes;
