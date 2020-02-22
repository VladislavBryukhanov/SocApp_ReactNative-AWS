/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN
var authSocAppMobileUserPoolId = process.env.AUTH_SOCAPPMOBILE_USERPOOLID

Amplify Params - DO NOT EDIT */
const updateDb = require('/opt/nodejs/db-utils');

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const cisp = new AWS.CognitoIdentityServiceProvider();

const TableName = process.env.STORAGE_USERLIST_NAME;
const mutableUserPoolAttributes = ['nickname'];

const updateUserPool = async (UserAttributes, body) => {
  const updatedAttributes = (Object.keys(body)).reduce((acc, key) => {
    if (mutableUserPoolAttributes.includes(key)) {
      return [ ...acc, {
          Name: key,
          Value: body[key]
        }
      ]
    }

    return acc;
  }, []);

  const params = {
    UserPoolId: process.env.AUTH_SOCAPPMOBILE_USERPOOLID,
    Username: UserAttributes['cognito:username'],
    UserAttributes: updatedAttributes
  };

  return cisp.adminUpdateUserAttributes(params).promise();
}

exports.handler = async (event, context) => {
  const UserAttributes = event.requestContext.authorizer.claims;
  const body = JSON.parse(event.body);

  await Promise.all([
    updateUserPool(UserAttributes, body),
    updateDb(event, dynamoDb, TableName),
  ]);

  return { statusCode: 200 };
};