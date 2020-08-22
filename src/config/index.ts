import AWS from 'aws-sdk';

class Config {
  static index() {
    this.general();
    AWS.config.dynamodb = { endpoint: 'http://dynamodb.us-east-2.amazonaws.com' };
    AWS.config.s3 = { endpoint: 'http://s3.us-east-2.amazonaws.com' };
  }

  static general() {
    // have to config credentials in profile documant
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html
    const credentials = new AWS.SharedIniFileCredentials({ profile: 'documant' });
    AWS.config.credentials = credentials;
    AWS.config.region = 'us-east-2';
  }

  static configDynamo() {
    Config.general();
    AWS.config.dynamodb = { endpoint: 'http://dynamodb.us-east-2.amazonaws.com' };
  }

  static configS3() {
    Config.general();
    AWS.config.s3 = { endpoint: 'http://s3.us-east-2.amazonaws.com' };
  }

  static resetConfig() {
    console.log('Not implementted yet');
  }
}

export default Config;
