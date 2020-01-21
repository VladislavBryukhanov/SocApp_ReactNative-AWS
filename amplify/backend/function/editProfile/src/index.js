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
const cisp = new AWS.CognitoIdentityServiceProvider();

let TableName = 'userList';
if(process.env.ENV && process.env.ENV !== "NONE") {
  TableName = `${TableName}-${process.env.ENV}`;
}

// cognito user 'sub' is unique id of it
const primaryKeys = [
  { dynamodbField: 'id', userPoolAttribute: 'sub' },
  { dynamodbField: 'username', userPoolAttribute: 'preferred_username' },
];

exports.handler = async (event, context) => {
  const { cognitoUsername } = context.clientContext;

  if (!cognitoUsername) {
    throw Error('cognitoUsername doesn\'t provided to clientContext');
  }

  const params = {
    UserPoolId: process.env.AUTH_SOCAPPMOBILE_USERPOOLID,
    Username: cognitoUsername
  };
  const { UserAttributes } = await cisp.adminGetUser(params).promise();

  const Key = {};
  primaryKeys.forEach(({ userPoolAttribute, dynamodbField }) => {
    const { Value } = UserAttributes.find(({ Name }) => Name === userPoolAttribute);
    Key[dynamodbField] = Value;
  });

  console.log(event);

  const queryParams = { 
    TableName,
    Key,
    // AttributeUpdates: { 
    //   ...event
    // },
    // UpdateExpression: "SET bio = :bio",
    // ExpressionAttributeValues: { 
    //     ":bio": "Global Records"
    // }
    // AttributeUpdates: { bio: { Action: 'PUT', Value: 'Test' } }
    AttributeUpdates: (Object.keys(event)).reduce((acc, prop) => {
      return {
        ...acc,
        [prop]: {
          Action: 'PUT',
          Value: event[prop]
        }
      }
    }, {})
  };
  
  return dynamoDb.update(queryParams).promise();
};