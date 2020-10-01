import { Router } from 'express';
import multer from 'multer';
import UsersController from './controllers/UsersControllers';
import FilesController from './controllers/FilesControllers';
import LoginController from './controllers/LoginController';
import MultConfig from './config/multer';
import DocumentController from './controllers/DocumentController';
import authenticate from './controllers/middlewares/auth';

const routes = Router();

routes
  .get('/users', UsersController.find)
  .post('/users', UsersController.create)
  .put('/users', authenticate, UsersController.update)
  .put('/users/item', authenticate, UsersController.addItem)
  .put('/users/done', authenticate, UsersController.setDoneItems)
  .delete('/users', authenticate, UsersController.delete)
  .delete('/users/fake', authenticate, UsersController.fakeDelete)

  .get('/document', authenticate, DocumentController.find)
  .post('/document', authenticate, DocumentController.create)
  .put('/document', authenticate, DocumentController.update)
  .put('/document/public', authenticate, DocumentController.setPublic)

  .get('/login', LoginController.login)
  .get('/logout', LoginController.logout)

  .get('/files', authenticate, FilesController.find)
  .post('/files', authenticate, multer(MultConfig).single('file'), FilesController.create)
  .delete('/files', authenticate, FilesController.delete)

  // Get all wrong routes
  .all('*', (req, res) => res.status(404).json({ error: 'Route not found' }));

export default routes;
