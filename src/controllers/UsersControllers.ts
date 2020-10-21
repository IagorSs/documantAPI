/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import IExternDocument, {} from '../interfaces/DynamoDB/IExternDocument';

export default class UsersController {
  static readonly TableName = process.env.USER_TABLE_NAME || ''

  static async getClient() {
    return new AWS.DocumentClient();
  }

  static checkUserEnv() {
    if (!process.env.USER_TABLE_NAME) {
      throw {
        statusCode: 500,
        message: 'User table not setted',
      };
    }
  }

  static async getItem(email:string) {
    UsersController.checkUserEnv();

    const docClient = await UsersController.getClient();

    const data = await docClient.get({
      TableName: UsersController.TableName,
      Key: { emailID: email },
    }).promise();

    if (data.Item) {
      return data.Item;
    }

    throw {
      statusCode: 500,
      message: 'User not found',
    };
  }

  static async create(req:Request, res:Response, next: NextFunction) {
    try {
      UsersController.checkUserEnv();

      const docClient = await UsersController.getClient();

      const {
        name,
        email,
        companyName,
        CPF,
        pass,
      } = req.body;

      const alreadyExistUserPromise = new Promise<boolean>((resolve) => {
        docClient.get({
          TableName: UsersController.TableName,
          Key: { emailID: email },
        }, (err, data) => resolve(data.Item != null));
      });

      if (!await alreadyExistUserPromise) {
        const hashedPassword = await bcrypt.hash(pass, 10);
        const input = {
          state: {
            createdOn: new Date().toString(),
            updatedOn: new Date().toString(),
            isDeleted: false,
          },
          name,
          emailID: email,
          companyName,
          CPF,
          password: hashedPassword,
          myTodoTemplates: [],
          myDocuments: [],
          todoTemplates: [],
          documents: [],
        };

        const params = {
          TableName: UsersController.TableName,
          Item: input,
        };

        const data = await docClient.put(params).promise();
        return res.status(200).json(data);
      }

      throw {
        statusCode: 500,
        message: 'Trying to create an user that already exists',
      };
    } catch (error) {
      return next(error);
    }
  }

  static async find(req:Request, res:Response, next: NextFunction) {
    try {
      const dataItem = await UsersController.getItem(req.body.email);

      delete dataItem.password;

      return res.status(200).json(dataItem);
    } catch (error) {
      return next(error);
    }
  }

  static async update(req:Request, res:Response, next: NextFunction) {
    try {
      const { email, key, value } = req.body;

      if (email) {
        UsersController.checkUserEnv();

        const dataItem = await UsersController.getItem(email);

        const params = {
          TableName: UsersController.TableName,
          Key: { emailID: email },
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

        const docClient = await UsersController.getClient();

        const data = await docClient.update(params).promise();

        return res.status(200).json(data);
      }

      throw {
        statusCode: 401,
        message: 'there is no user logged in',
      };
    } catch (error) {
      return next(error);
    }
  }

  static async delete(req:Request, res:Response, next: NextFunction) {
    try {
      UsersController.checkUserEnv();

      const {
        email,
      } = req.body;

      const dataItem = await UsersController.getItem(email);

      const client = await UsersController.getClient();

      const data = await client.delete({
        TableName: UsersController.TableName,
        Key: { emailID: email },
      }).promise();

      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }

  static async fakeDelete(req:Request, res:Response, next: NextFunction) {
    try {
      UsersController.checkUserEnv();

      const {
        email,
      } = req.body;

      const dataItem = await UsersController.getItem(email);

      const params = {
        TableName: UsersController.TableName,
        Key: { emailID: email },
        AttributeUpdates: {
          state: {
            Action: 'PUT',
            Value: {
              ...dataItem.state,
              updatedOn: new Date().toString(),
              isDeleted: true,
            },
          },
        },
      };

      const docClient = await UsersController.getClient();

      const data = await docClient.update(params).promise();

      return res.status(200).json(data);
    } catch (error) {
      return next(error);
    }
  }

  static async addItem(req:Request, res:Response, next: NextFunction) {
    try {
      UsersController.checkUserEnv();

      const {
        email,
        itemID,
        type,
        owner,
      } = req.body;

      const dataItem = await UsersController.getItem(email);

      let key;

      if (type === 'document') key = owner ? 'myDocuments' : 'documents';
      else if (type === 'todo') key = owner ? 'myTodoTemplates' : 'todoTemplates';

      if (key) {
        const Value = owner ? [...dataItem[key], itemID] : [...dataItem[key], {
          isDone: false,
          itemID,
        }];

        const params = {
          TableName: UsersController.TableName,
          Key: { emailID: email },
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
              Value,
            },
          },
        };

        const docClient = await UsersController.getClient();

        await docClient.update(params).promise();

        return res.sendStatus(200);
      }

      throw {
        statusCode: 500,
        message: 'Invalid type of Item',
      };
    } catch (error) {
      return next(error);
    }
  }

  static async setDoneItems(req:Request, res:Response, next: NextFunction) {
    try {
      UsersController.checkUserEnv();

      const {
        email,
        changeItems,
        type,
      } = req.body;

      const dataItem = await UsersController.getItem(email);

      let key:string = '';

      if (type === 'document') key = 'documents';
      else if (type === 'todo') key = 'todoTemplates';

      if (key) {
        changeItems.map((item:{
          itemIndex: number,
          isDone: boolean
        }) => {
          dataItem[key][item.itemIndex] = {
            ...dataItem[key][item.itemIndex],
            isDone: item.isDone,
          };
          return null;
        });

        const params = {
          TableName: UsersController.TableName,
          Key: { emailID: email },
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
              Value: dataItem[key],
            },
          },
        };

        const docClient = await UsersController.getClient();

        await docClient.update(params).promise();

        return res.sendStatus(200);
      }

      throw {
        statusCode: 500,
        message: 'Invalid type of Item',
      };
    } catch (error) {
      return next(error);
    }
  }
}
