/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

const targetTriggerSource = 'PostConfirmation_ConfirmSignUp';
const targetAttributes = [
  { userPoolKey: 'sub', dynamoDbKey: 'id' },
  { userPoolKey: 'nickname', dynamoDbKey: 'nickname' },
  { userPoolKey: 'preferred_username', dynamoDbKey: 'username' }
];

let TableName = 'userList';
if(process.env.ENV && process.env.ENV !== "NONE") {
  TableName = `${TableName}-${process.env.ENV}`;
}

exports.handler = function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const { triggerSource, request: { userAttributes } } = event;

  if (triggerSource !== targetTriggerSource) {
    return callback(null, event);
  }

  const Item = targetAttributes.reduce((acc, { userPoolKey, dynamoDbKey  }) => ({
    ...acc,
    [dynamoDbKey]: userAttributes[userPoolKey]
  }), {});
  
  const queryParams = { TableName, Item };
  dynamodb.put(queryParams, (err, data) => callback(err, event));
};
