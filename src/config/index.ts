import AWS from 'aws-sdk';
import keys from '../keys.json';

export default function index() {
  console.log(keys);
  const awsConfig = {
    region: 'us-east-2',
    endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
    acessKeyId: keys.acessKeyId,
    secretAcessKey: keys.secretAcessKey,
  };

  AWS.config.update(awsConfig);
}
