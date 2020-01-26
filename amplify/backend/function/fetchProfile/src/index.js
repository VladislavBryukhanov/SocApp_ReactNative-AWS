/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN
var authSocAppMobileUserPoolId = process.env.AUTH_SOCAPPMOBILE_USERPOOLID

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

let TableName = "userList";
if(process.env.ENV && process.env.ENV !== "NONE") {
  TableName = `${TableName}-${process.env.ENV}`;
}

// cognito user 'sub' is unique id of it
const primaryKeys = [
  { dynamodbField: 'id', userPoolAttribute: 'sub' },
  { dynamodbField: 'username', userPoolAttribute: 'preferred_username' },
];

exports.handler = async function (event, context) {
  const UserAttributes = event.requestContext.authorizer.claims;

  const Key = {};
  primaryKeys.forEach(({ userPoolAttribute, dynamodbField }) => {
    Key[dynamodbField] = UserAttributes[userPoolAttribute];
  });
  
  const queryParams = { TableName, Key };
  const { Item: profile } = await dynamoDb.get(queryParams).promise();
  
  return {
    statusCode: 200,
    body: JSON.stringify({ profile })
  };
};