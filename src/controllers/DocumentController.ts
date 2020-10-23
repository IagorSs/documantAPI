import AWS from 'aws-sdk/clients/dynamodb';
import crypto from 'crypto';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import UsersController from './UsersControllers';

const TableName = process.env.DOCUMENT_TABLE_NAME || '';

export default {

  async getClient() {
    return new AWS.DocumentClient();
  },

  checkDocumentEnv() {
    if (!process.env.DOCUMENT_TABLE_NAME) {
      throw {
        statusCode: 500,
        message: 'User table not setted',
      };
    }
  },

  async getItem(titleID:string) {
    this.checkDocumentEnv();

    const docClient = await this.getClient();

    try {
      const data = await docClient.get({
        TableName,
        Key: { titleID },
      }).promise();

      return data.Item;
    } catch (error) {
      return {};
    }
  },

  async find(req:Request, res:Response) {
    try {
      const data = await this.getItem(req.body.title);

      if (data) {
        return res.status(200).json(data);
      }

      throw {
        statusCode: 500,
        message: 'Item not found',
      };
    } catch (error) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  },

  async create(req:Request, res:Response, next:NextFunction) {
    try {
      this.checkDocumentEnv();

      const {
        title,
        description,
        email,
        S3File,
      } = req.body;

      const client = await this.getClient();

      let titleID:string;

      do {
        titleID = `${crypto.randomBytes(16).toString('hex')}-${title}`;
        // eslint-disable-next-line no-await-in-loop
      } while (await this.getItem(titleID));

      const params = {
        TableName,
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
  },

  async update(req:Request, res:Response) {
    try {
      this.checkDocumentEnv();

      const { titleID, key, value } = req.body;

      const dataItem = await this.getItem(titleID);

      if (dataItem) {
        const params = {
          TableName,
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

        const docClient = await this.getClient();

        const data = await docClient.update(params).promise();

        return res.status(200).json(data);
      }

      throw {
        statusCode: 500,
        message: 'Item not found',
      };
    } catch (error) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  },

  async setPublic(req:Request, res:Response) {
    try {
      const { titleID } = req.body;

      const dataItem = await this.getItem(titleID);

      if (dataItem) {
        const params = {
          TableName,
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

        const docClient = await this.getClient();

        const data = await docClient.update(params).promise();

        return res.status(200).json(data);
      }

      throw {
        statusCode: 500,
        message: 'Item not found',
      };
    } catch (error) {
      return res.status(error.statusCode || 500).json({ error: error.message });
    }
  },
};
