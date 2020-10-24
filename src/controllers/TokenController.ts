/* eslint-disable no-console */
import AWS from 'aws-sdk/clients/dynamodb';
import { InternalServerError } from '../utils/errors/APIErrors';

const TableName = process.env.TOKEN_TABLE_NAME || '';

async function getClient() {
  return new AWS.DocumentClient();
}

async function insertToken(tokens:{tokenID:string, refreshToken:string}) {
  const params = {
    TableName,
    Item: tokens,
  };

  const docClient = await getClient();

  const returningObgPromise = new Promise<Object>((resolve) => {
    docClient.put(params, (err, data) => {
      if (!err) {
        resolve({ data });

        return data;
      }
      throw new InternalServerError(`Erro ao inserir o token - ${err.message}`);
    });
  });

  return returningObgPromise;
}

async function deleteToken(token:string) {
  const docClient = await getClient();

  const data = await docClient.delete({
    TableName,
    Key: { tokenID: token },
  }).promise();

  return data;
}

export default {
  insertToken,
  deleteToken,
};
