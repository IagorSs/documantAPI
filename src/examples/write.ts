import AWS from 'aws-sdk';

import config from './config';

config();

const docClient = new AWS.DynamoDB.DocumentClient();

const save = () => {
  const input = {
    email_id: 'example-2@gmail.com',
    created_by: 'clientuser',
    created_on: new Date().toString(),
    updated_by: 'clienteuser',
    updated_on: new Date().toString(),
    is_deleted: false,
  };

  const params = {
    TableName: 'users',
    Item: input,
  };
  // eslint-disable-next-line no-unused-vars
  docClient.put(params, (err) => {
    if (err) console.log(`erro - ${JSON.stringify(err, null, 2)}`);
    else console.log('sucess');
  });
};

save();
