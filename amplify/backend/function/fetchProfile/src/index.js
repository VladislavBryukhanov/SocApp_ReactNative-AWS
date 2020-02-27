/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN
var authSocAppMobileUserPoolId = process.env.AUTH_SOCAPPMOBILE_USERPOOLID

Amplify Params - DO NOT EDIT */

const UsersDB = require('/opt/nodejs/db-utils');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.STORAGE_USERLIST_NAME;

exports.handler = async (event) => {
  const db = new UsersDB(dynamoDb, TableName, event);
  const profile = await db.fetchUserProfile();

  return {
    statusCode: 200,
    body: JSON.stringify({ profile })
  };
};