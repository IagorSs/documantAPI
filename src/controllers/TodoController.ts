import AWS from 'aws-sdk/clients/dynamodb';
import crypto from 'crypto';
// eslint-disable-next-line no-unused-vars
import { NextFunction, Request, Response } from 'express';
import { successfulCodes } from '../utils/httpCodes';
import { BadGatewayError, BadRequestError } from '../utils/errors/APIErrors';

const TableName = process.env.TODO_TABLE_NAME || '';

async function getClient() {
  return new AWS.DocumentClient();
}

async function getItem(id:string) {
  const docClient = await getClient();

  const data = await docClient.get({
    TableName,
    Key: { id },
  }).promise();

  if (data.Item) return data.Item;
  throw new BadGatewayError("Item not found");
}

async function getRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const data = await getItem(req.params.id);

    return res.status(successfulCodes.IM_USED).json(data);
  } catch (error) {
    next(error);
  }
}

async function getAllItemsRoutes(req:Request, res:Response, next:NextFunction) {
  try {
    const params:any = {
      TableName,
    };

    const documentClient = await getClient();

    const scanResults:any = [];
    let items;

    do {
      // eslint-disable-next-line no-await-in-loop
      items = await documentClient.scan(params).promise();
      if (items.Items) items.Items.forEach((item) => scanResults.push(item));
      params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey !== "undefined");

    return res.status(successfulCodes.OK).json(scanResults);
  } catch (error) {
    next(error);
  }
}

async function postRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const {
      title,
      description,
      email,
      documents,
    } = req.body;

    const client = await getClient();

    const id = `${crypto.randomBytes(16).toString('hex')}-${title.replace(/\s+/g, '')}`;

    const params = {
      TableName,
      Item: {
        state: {
          created_on: new Date().toString(),
          updated_on: new Date().toString(),
          is_deleted: false,
        },
        // isPublic: false,
        id,
        title,
        description,
        // userCreator: email,
        documents: documents || [],
      },
    };

    await client.put(params).promise();

    res
      .status(successfulCodes.CREATED)
      .json({ id });
  } catch (error) {
    next(error);
  }
}

async function update(id:string, key:string, value:any) {
  const dataItem = await getItem(id);

  if (!Object.keys(dataItem).includes(key)) throw new BadRequestError("Invalid Key");

  const params = {
    TableName,
    Key: { id },
    AttributeUpdates: {
      state: {
        Action: 'PUT',
        Value: {
          ...dataItem.state,
          updated_on: new Date().toString(),
        },
      },
      [key]: {
        Action: 'PUT',
        Value: value,
      },
    },
  };

  const docClient = await getClient();

  await docClient.update(params).promise();
}

async function putRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const { id } = req.params;
    const { key, value } = req.body;

    update(id, key, value);

    return res.sendStatus(successfulCodes.ACCEPTED);
  } catch (error) {
    next(error);
  }
}

async function addDocumentRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const { id } = req.params;
    const { documentID } = req.query;

    const dataItem = await getItem(id);

    update(id, "documents", [...dataItem.documents, documentID]);

    return res.sendStatus(successfulCodes.ACCEPTED);
  } catch (error) {
    next(error);
  }
}

async function removeDocumentRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const { id } = req.params;
    const { documentID } = req.query;

    const dataItem = await getItem(id);

    update(id, "documents", await dataItem.documents.filter((value:string) => value !== documentID));

    return res.sendStatus(successfulCodes.ACCEPTED);
  } catch (error) {
    next(error);
  }
}

async function deleteRoute(req:Request, res:Response, next:NextFunction) {
  try {
    const {
      id,
    } = req.params;

    await getItem(id);

    const client = await getClient();

    await client.delete({
      TableName,
      Key: { id },
    }).promise();

    return res.sendStatus(successfulCodes.OK);
  } catch (error) {
    return next(error);
  }
}

export default {
  getRoute,
  getAllItemsRoutes,
  postRoute,
  putRoute,
  addDocumentRoute,
  removeDocumentRoute,
  deleteRoute,
};
