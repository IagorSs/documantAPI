import AWS from 'aws-sdk';
import keys from '../keys.json';

class Config {
  static index() {
    this.general();
    this.configDynamo();
    this.configS3();
  }

  static general() {
    const awsConfig = {
      region: 'us-east-2',
      acessKeyId: keys.AWS.acessKeyId,
      secretAcessKey: keys.AWS.secretAcessKey,
    };

    AWS.config.update(awsConfig);
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
