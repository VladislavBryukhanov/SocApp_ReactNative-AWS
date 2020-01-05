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

let tableName = "userList";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = `${tableName}-${process.env.ENV}`;
}

const queryParams = {
  TableName: tableName
};

exports.handler = function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  dynamodb.scan(queryParams, callback);
};
