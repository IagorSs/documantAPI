/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import {
  NextFunction, Request, Response,
} from 'express';
import AWS from 'aws-sdk/clients/dynamodb';
import bcrypt from 'bcrypt';
import { BadGatewayError, BadRequestError, InternalServerError } from '../utils/errors/APIErrors';
import { successfulCodes } from '../utils/httpCodes';

const TableName = process.env.USER_TABLE_NAME || '';

async function getClient() {
  return new AWS.DocumentClient();
}

async function getItem(email:string) {
  const docClient = await getClient();

  const data = await docClient.get({
    TableName,
    Key: { emailID: email },
  }).promise();

  if (data.Item) {
    return data.Item;
  }

  throw new BadGatewayError("User not found");
}

async function create(req:Request, res:Response, next: NextFunction):Promise<any> {
  try {
    const docClient = await getClient();

    const {
      name,
      email,
      companyName,
      CPF,
      pass,
    } = req.body;

    const alreadyExistUserPromise = new Promise<boolean>((resolve) => {
      docClient.get({
        TableName,
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
        TableName,
        Item: input,
      };

      const data = await docClient.put(params).promise();
      return res.status(200).json(data);
    }

    throw new InternalServerError('Trying to create an user that already exists');
  } catch (error) {
    next(error);
  }
}

async function find(req:Request, res:Response, next: NextFunction) {
  try {
    const dataItem = await getItem(req.body.email);

    delete dataItem.password;

    return res.status(successfulCodes.IM_USED).json(dataItem);
  } catch (error) {
    next(error);
  }
}

async function update(req:Request, res:Response, next: NextFunction) {
  try {
    const { email, key, value } = req.body;

    const dataItem = await getItem(email);

    const params = {
      TableName,
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

    const docClient = await getClient();

    const data = await docClient.update(params).promise();

    return res.status(successfulCodes.ACCEPTED).json(data);
  } catch (error) {
    next(error);
  }
}

async function trueDelete(req:Request, res:Response, next:NextFunction) {
  try {
    const {
      email,
    } = req.body;

    await getItem(email);

    const client = await getClient();

    const data = await client.delete({
      TableName,
      Key: { emailID: email },
    }).promise();

    return res.status(successfulCodes.OK).json(data);
  } catch (error) {
    return next(error);
  }
}

async function fakeDelete(req:Request, res:Response, next: NextFunction) {
  try {
    const {
      email,
    } = req.body;

    const dataItem = await getItem(email);

    const params = {
      TableName,
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

    const docClient = await getClient();

    const data = await docClient.update(params).promise();

    return res.status(successfulCodes.OK).json(data);
  } catch (error) {
    next(error);
  }
}

async function addItem(req:Request, res:Response, next: NextFunction) {
  try {
    const {
      email,
      itemID,
      type,
      owner,
    } = req.body;

    const dataItem = await getItem(email);

    let key;

    if (type === 'document') key = owner ? 'myDocuments' : 'documents';
    else if (type === 'todo') key = owner ? 'myTodoTemplates' : 'todoTemplates';

    if (key) {
      const Value = owner ? [...dataItem[key], itemID] : [...dataItem[key], {
        isDone: false,
        itemID,
      }];

      const params = {
        TableName,
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

      const docClient = await getClient();

      await docClient.update(params).promise();

      return res.sendStatus(successfulCodes.ACCEPTED);
    }

    throw new BadRequestError("Invalid type of Item");
  } catch (error) {
    next(error);
  }
}

async function setDoneItems(req:Request, res:Response, next: NextFunction) {
  try {
    const {
      email,
      changeItems,
      type,
    } = req.body;

    const dataItem = await getItem(email);

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
        TableName,
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

      const docClient = await getClient();

      await docClient.update(params).promise();

      return res.sendStatus(successfulCodes.ACCEPTED);
    }

    throw new BadRequestError("Invalid type of Item");
  } catch (error) {
    next(error);
  }
}

export default {
  getItem,
  create,
  find,
  update,
  trueDelete,
  fakeDelete,
  addItem,
  setDoneItems,
};
