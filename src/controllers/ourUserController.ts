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
      // eslint-disable-next-line consistent-return
      return docClient.get(params, (err, data) => {
        if (err) {
          console.log(`erro no find 2 - ${err.message}`);
          return err;
        }
        const returningObj = {
          ...data,
          message: null,
        };
        return returningObj;
      });
    } catch (error) {
      return error;
    }
  }
}

export default User;
