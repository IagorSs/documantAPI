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
  .get('/document/:id', DocumentController.getRoute)
  .get('/document/list/all', DocumentController.getAllItemsRoutes)
  .put('/document/:id', DocumentController.putRoute)
  .post('/document', DocumentController.postRoute)
  .delete('/document/:id', DocumentController.deleteRoute)

  // Todo methods
  .get('/todo/:id', TodoController.getRoute)
  .get('/todo/list/all', TodoController.getAllItemsRoutes)
  .put('/todo/:id', TodoController.putRoute)
  .post('/todo', TodoController.postRoute)
  .delete('/todo/:id', TodoController.deleteRoute)

  // /todo/addDocument/{todo_id}?documentID={documentID}
  .put('/todo/addDocument/:id', TodoController.addDocumentRoute)
  .delete('/todo/removeDocument/:id', TodoController.removeDocumentRoute)

  // Files methods
  .get('/file/:id', FilesController.getRoute)
  .post('/file', multer(MultConfig).single('file'), FilesController.postRoute)
  .delete('/file/:id', FilesController.deleteRoute)

  // Get all wrong routes
  .all('*', (req, res, next) => {
    next(new NotFoundError());
  });

export default routes;
