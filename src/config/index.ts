import AWS from 'aws-sdk';
import readKeys from './keys';

export default function index() {
  const globalKeys = readKeys();
  const awsConfig = {
    region: 'us-east-2',
    endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
    acessKeyId: globalKeys.acessKeyId,
    secretAcessKey: globalKeys.secretAcessKey,
  };

  AWS.config.update(awsConfig);
}
