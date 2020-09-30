/* eslint-disable no-console */
// eslint-disable-next-line no-unused-vars
import AWS from 'aws-sdk/clients/dynamodb';

class User {
  static async getClient() {
    return new AWS.DocumentClient();
  }

  static async find(email:string) {
    const params = {
      TableName: 'user_documant_db',
      Key: {
        emailID: email,
      },
    };
    try {
      const docClient = await User.getClient();
      const data = await docClient.get(params).promise();
      if (!data.Item) {
        throw {
          statusCode: 500,
          message: 'Item not found',
        };
      }
      return data.Item;
    } catch (error) {
      const { message, statusCode } = error;
      return {
        message,
        statusCode,
      };
    }
  }
}

export default User;
