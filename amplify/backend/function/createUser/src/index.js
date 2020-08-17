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
const TableName = process.env.STORAGE_USERLIST_NAME;

const targetTriggerSource = 'PostConfirmation_ConfirmSignUp';

exports.handler = function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const { triggerSource, request: { userAttributes } } = event;

  if (triggerSource !== targetTriggerSource) {
    return callback(null, event);
  }

  const Item = {
    id: userAttributes.sub,
    nickname: userAttributes.nickname,
    username: userAttributes.preferred_username,
  }
  
  dynamodb.put({ TableName, Item }, (err, data) => callback(err, event));
};
