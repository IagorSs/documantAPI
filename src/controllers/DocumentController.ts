import AWS from 'aws-sdk/clients/dynamodb';
import crypto from 'crypto';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import UsersController from './UsersControllers';

export default class DocumentController {
  static readonly TableName = process.env.DOCUMENT_TABLE_NAME || ''

  static async getClient() {
    return new AWS.DocumentClient();
  }

  static checkDocumentEnv() {
    if (!process.env.DOCUMENT_TABLE_NAME) {
      throw {
        statusCode: 500,
        message: 'User table not setted',
      };
    }
  }

  static async getItem(titleID:string) {
    DocumentController.checkDocumentEnv();

    const docClient = await DocumentController.getClient();

    try {
      const data = await docClient.get({
        TableName: DocumentController.TableName,
        Key: { titleID },
      }).promise();

      return data.Item;
    } catch (error) {
      return {};
    }
  }

  static async find(req:Request, res:Response) {
    try {
      const data = await DocumentController.getItem(req.body.title);

      if (!data) {
        throw {
          statusCode: 500,
          message: 'Item not found',
        };
      }

      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  }

  static async create(req:Request, res:Response, next:NextFunction) {
    try {
      DocumentController.checkDocumentEnv();

      const {
        title,
        description,
        email,
        S3File,
      } = req.body;

      const client = await DocumentController.getClient();

      let titleID:string;

      do {
        titleID = `${crypto.randomBytes(16).toString('hex')}-${title}`;
        // eslint-disable-next-line no-await-in-loop
      } while (await DocumentController.getItem(titleID));

      const params = {
        TableName: DocumentController.TableName,
        Item: {
          state: {
            createdOn: new Date().toString(),
            updatedOn: new Date().toString(),
            isDeleted: false,
          },
          isPublic: false,
          titleID,
          title,
          description,
          userCreator: email,
          S3File,
        },
      };

      await client.put(params).promise();

      req.body = {
        email,
        itemID: titleID,
        type: 'document',
        owner: true,
      };

      await UsersController.addItem(req, res, next);

      return res.sendStatus(200);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  static async update(req:Request, res:Response) {
    try {
      DocumentController.checkDocumentEnv();

      const { titleID, key, value } = req.body;

      const dataItem = await DocumentController.getItem(titleID);

      if (!dataItem) {
        throw {
          statusCode: 500,
          message: 'Item not found',
        };
      }

      const params = {
        TableName: DocumentController.TableName,
        Key: { titleID },
        AttributeUpdates: {
          state: {
            Action: 'PUT',
            Value: {
              ...dataItem.state,
              updatedOn: new Date().toString(),
            },
          },
          [key]: {
            Action: 'PUT',
            Value: value,
          },
        },
      };

      const docClient = await DocumentController.getClient();

      const data = await docClient.update(params).promise();

      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  }

  static async setPublic(req:Request, res:Response) {
    try {
      const { titleID } = req.body;

      const dataItem = await DocumentController.getItem(titleID);

      if (!dataItem) {
        throw {
          statusCode: 500,
          message: 'Item not found',
        };
      }

      const params = {
        TableName: DocumentController.TableName,
        Key: { titleID },
        AttributeUpdates: {
          state: {
            Action: 'PUT',
            Value: {
              ...dataItem.state,
              updatedOn: new Date().toString(),
            },
          },
          isPublic: {
            Action: 'PUT',
            Value: true,
          },
        },
      };

      const docClient = await DocumentController.getClient();

      const data = await docClient.update(params).promise();

      return res.status(200).json(data);
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
