import AWS from 'aws-sdk';

import config from './config';

config();

const docClient = new AWS.DynamoDB.DocumentClient();

const deleteUser = () => {
  const params = {
    TableName: 'users',
    Key: { email_id: 'example-1@gmail.com' },
  };

  docClient.delete(params, (err) => {
    if (err) console.log(err);
    else console.log('Sucesso');
  });
};

export default deleteUser;
