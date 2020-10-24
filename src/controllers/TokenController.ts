/* eslint-disable no-console */
import AWS from 'aws-sdk/clients/dynamodb';

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
      if (err) {
        throw {
          statusCode: 500,
          message: `erro ao inserir o token - ${err.message}`,
        };
      }

      resolve({ data });

      return data;
    });
  });

  return returningObgPromise;
}

async function deleteToken(token:string) {
  const docClient = await getClient();

  const data = await docClient.delete({
    TableName: 'tokens',
    Key: { tokenID: token },
  }).promise();

  return data;
}

export default {
  insertToken,
  deleteToken,
};
