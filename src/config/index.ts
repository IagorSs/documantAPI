import AWS from 'aws-sdk';
import keys from '../keys.json';

class Config {
  static configDynamo() {
    const awsConfig = {
      region: 'us-east-2',
      acessKeyId: keys.acessKeyId,
      secretAcessKey: keys.secretAcessKey,
      endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
    };

    AWS.config.update(awsConfig);
  }

  static configS3() {
    const awsConfig = {
      region: 'us-east-2',
      acessKeyId: keys.acessKeyId,
      secretAcessKey: keys.secretAcessKey,
      endpoint: 'http://s3.us-east-2.amazonaws.com',
    };

    AWS.config.update(awsConfig);
  }

  static resetConfig() {
    console.log('Not implementted yet');
  }
}

export default Config;
