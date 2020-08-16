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

//TODO Paging
exports.handler = function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  dynamodb.scan({ TableName }, callback);
};
