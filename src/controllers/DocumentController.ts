import AWS from 'aws-sdk/clients/dynamodb';
import crypto from 'crypto';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import UsersController from './UsersControllers';

const TableName = process.env.DOCUMENT_TABLE_NAME || '';

async function getClient() {
  return new AWS.DocumentClient();
}

async function getItem(titleID:string) {
  const docClient = await getClient();

  try {
    const data = await docClient.get({
      TableName,
      Key: { titleID },
    }).promise();

    return data.Item;
  } catch (error) {
    return {};
  }
}

async function find(req:Request, res:Response) {
  try {
    const data = await getItem(req.body.title);

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
}

async function create(req:Request, res:Response, next:NextFunction) {
  try {
    const {
      title,
      description,
      email,
      S3File,
    } = req.body;

    const client = await getClient();

    let titleID:string;

    do {
      titleID = `${crypto.randomBytes(16).toString('hex')}-${title}`;
      // eslint-disable-next-line no-await-in-loop
    } while (await getItem(titleID));

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
}

async function update(req:Request, res:Response) {
  try {
    const { titleID, key, value } = req.body;

    const dataItem = await getItem(titleID);

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

      const docClient = await getClient();

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
}

async function setPublic(req:Request, res:Response) {
  try {
    const { titleID } = req.body;

    const dataItem = await getItem(titleID);

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

      const docClient = await getClient();

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
}

export default {
  getItem,
  find,
  create,
  update,
  setPublic,
};
