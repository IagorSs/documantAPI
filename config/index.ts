import AWS from 'aws-sdk';

export default function index() {
  const awsConfig = {
    region: 'us-east-2',
    endpoint: 'http://dynamodb.us-east-2.amazonaws.com',
    acessKeyId: 'AKIAJITK75WA2VT6BL4Q',
    secretAcessKey: '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',
  };

  AWS.config.update(awsConfig);
}
