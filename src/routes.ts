import { Router } from 'express';
import multer from 'multer';
import UsersController from './controllers/UsersControllers';
import FilesController from './controllers/FilesControllers';
import LoginController from './controllers/loginController';
import MultConfig from './config/multer';
import DocumentController from './controllers/DocumentController';

const routes = Router();

routes
  .get('/users', UsersController.find)
  .post('/users', UsersController.create)
  .put('/users', UsersController.update)
  .put('/users/item', UsersController.addItem)
  .put('/users/done', UsersController.setDoneItems)
  .delete('/users', UsersController.delete)
  .delete('/users/fake', UsersController.fakeDelete)

  .get('/document', DocumentController.find)
  .post('/document', DocumentController.create)
  .put('./document', DocumentController.update)

  .get('/login', LoginController.login)

  .get('/files', FilesController.getFile)
  .delete('/files', FilesController.deleteFile)
  .post('/files', multer(MultConfig).single('file'), FilesController.uploadFile)

  // Get all wrong routes
  .all('*', (req, res) => res.status(200).json({ Erro: 'Error 404, route not found' }));

export default routes;
