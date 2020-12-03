import { Router } from 'express';
import multer from 'multer';
import UsersController from '../controllers/UsersControllers';
import FilesController from '../controllers/FilesController';
import LoginController from '../controllers/LoginController';
import MultConfig from '../config/multer';
import DocumentController from '../controllers/DocumentController';
import authenticate from '../controllers/middlewares/auth';
import { NotFoundError } from '../utils/errors/APIErrors';

const routes = Router();

routes
  .get('/users', UsersController.find)
  .post('/users', UsersController.create)
  .put('/users', authenticate, UsersController.update)
  .put('/users/item', authenticate, UsersController.addItem)
  .put('/users/done', authenticate, UsersController.setDoneItems)
  .delete('/users', authenticate, UsersController.trueDelete)
  .delete('/users/fake', authenticate, UsersController.fakeDelete)

  .get('/document', authenticate, DocumentController.getRoute)
  .post('/document', authenticate, DocumentController.postRoute)
  .put('/document', authenticate, DocumentController.putRoute)
  .put('/document/public', authenticate, DocumentController.setPublic)

  .get('/login', LoginController.login)
  .get('/logout', LoginController.logout)

  .get('/files', authenticate, FilesController.getRoute)
  .post('/files', authenticate, multer(MultConfig).single('file'), FilesController.postRoute)
  // .post('/multiple-files', authenticate, multer(MultConfig).array('file'))
  .delete('/files', authenticate, FilesController.deleteRoute)

  // Get all wrong routes
  .all('*', (req, res, next) => {
    next(new NotFoundError());
  });

export default routes;
