/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import AWS from 'aws-sdk/clients/dynamodb';

class User {
  static async getClient() {
    return new AWS.DocumentClient();
  }

  static async find(username:string) {
    const params = {
      TableName: 'users_document_db',
      Key: {
        user: username,
      },
    };
    try {
      const docClient = await User.getClient();
      const returningObj = new Promise<Object>((resolve) => {
        docClient.get(params, (err, data) => {
          if (Object.keys(data).length === 0) {
            console.log(`erro no find 2 - ${err}`); // err sempre retorna null (mesmo caso não ache usuário)
            resolve({
              message: 'usuário não encontrado',
            });
            return err;
          }
          resolve({
            ...data,
            message: null,
          });
          return data;
        });
      });
      await returningObj;
      return returningObj;
    } catch (error) {
      return error.message;
    }
  }
}

export default User;
