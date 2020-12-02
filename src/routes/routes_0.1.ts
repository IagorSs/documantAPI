import { Router } from "express";
import multer from 'multer';
import { NotFoundError } from "../utils/errors/APIErrors";
import MultConfig from '../config/multer';
import FilesController from "../controllers/FilesController";
import DocumentController from "../controllers/DocumentController";
import TodoController from "../controllers/TodoController";

const routes = Router();

routes
  // Document methods
  .get('/document/:id', DocumentController.find)
  .get('/document/list/all', DocumentController.allItems)
  .put('/document/:id', DocumentController.update)
  .post('/document', DocumentController.create)
  .delete('/document/:id', DocumentController.trueDelete)

  // Todo methods
  .get('/todo/:id', TodoController.find)
  .get('/todo/list/all', TodoController.allItems)
  .put('/todo/:id', TodoController.update)
  .post('/todo', TodoController.create)
  .delete('/todo/:id', TodoController.trueDelete)

  // /todo/addDocument/{todo_id}?documentID={documentID}
  .put('/todo/addDocument/:id', TodoController.addDocument)
  .delete('/todo/removeDocument/:id', TodoController.removeDocument)

  // Files methods
  .get('/file/:id', FilesController.find)
  .post('/file', multer(MultConfig).single('file'), FilesController.create)
  .delete('/file/:id', FilesController.trueDelete)

  // Get all wrong routes
  .all('*', (req, res, next) => {
    next(new NotFoundError());
  });

export default routes;
