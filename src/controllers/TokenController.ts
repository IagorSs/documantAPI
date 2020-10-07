/* eslint-disable no-console */
import AWS from 'aws-sdk/clients/dynamodb';

class TokenController {
  static readonly TableName = process.env.TOKEN_TABLE_NAME || '';

  static async getClient() {
    return new AWS.DocumentClient();
  }

  static async insertToken(tokens:{tokenID:string, refreshToken:string}) {
    const params = {
      TableName: TokenController.TableName,
      Item: tokens,
    };

    const docClient = await TokenController.getClient();

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

  static async deleteToken(token:string) {
    const docClient = await TokenController.getClient();

    const data = await docClient.delete({
      TableName: 'tokens',
      Key: { tokenID: token },
    }).promise();

    return data;
  }
}

export default TokenController;
