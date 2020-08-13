import AWS from 'aws-sdk/clients/dynamodb';

import config from '../config';

config();

const docClient = new AWS.DocumentClient();
const fetchOneByKey = () => {
  const params = {
    TableName: 'users',
    Key: {
      email_id: 'iagor.wow@gmail.com',
    },
  };
  docClient.get(params, (err, data) => {
    if (err) {
      console.log(`users::fetchOneByKey::error - ${JSON.stringify(err, null, 2)}`);
    } else {
      console.log(`users::fetchOneByKey::sucess - ${JSON.stringify(data, null, 2)}`);
    }
  });
};

fetchOneByKey();
