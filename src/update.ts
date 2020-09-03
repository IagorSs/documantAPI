import AWS from 'aws-sdk';

import config from './config';

config();

const docClient = new AWS.DynamoDB.DocumentClient();

const modify = () => {
  const teste = false;
  const params = {
    TableName: 'users',
    Key: { email_id: 'example-2@gmail.com' },
    AttributeUpdates: {
      update_by: {
        Action: 'PUT',
        Value: 'andreUser',
      },
      is_deleted: {
        Action: 'PUT',
        Value: teste,
      },
    }, /*
    UpdateExpression: 'set update_by = :byUser, is_deleted = :boolValue',
    ExpressionAttributeValues: {
      ':byUser': 'andreUser',
      ':boolValue': true,
    }, */
    ReturnValues: 'UPDATED_NEW',
  };

  docClient.update(params, (err, data) => {
    if (err) console.log(err);
    else console.log(`SUCESSO - ${JSON.stringify(data)}`);
  });
};

modify();
