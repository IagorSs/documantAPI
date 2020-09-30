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

    const docClient = await User.getClient();
    const data = await docClient.get(params).promise();

    if (!data.Item) {
      throw {
        statusCode: 500,
        message: 'Item not found',
      };
    }

    return data.Item;
  }
}

export default User;
