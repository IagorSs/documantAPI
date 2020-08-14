import AWS from 'aws-sdk';

export default function index() {
  const awsConfig = {
    region: 'us-east-2',
    endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
    acessKeyId: global.acessKeyId,
    secretAcessKey: global.secretAcessKey,
  };

  AWS.config.update(awsConfig);
}
