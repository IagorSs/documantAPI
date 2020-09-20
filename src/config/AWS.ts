import AWS from 'aws-sdk';

export default function Config() {
  if (process.env.AWS_ACESS_KEY === '') { throw new Error('Variáveis de ambiente não estão configuradas'); }

  AWS.config.credentials = {
    accessKeyId: process.env.AWS_ACESS_KEY || '',
    secretAccessKey: process.env.AWS_SECRET_ACESS_KEY || '',
  };

  AWS.config.region = process.env.AWS_DEFAULT_REGION;

  AWS.config.dynamodb = { endpoint: process.env.DYNAMO_ENDPOINT };
  AWS.config.s3 = { endpoint: process.env.S3_ENDPOINT };
}
