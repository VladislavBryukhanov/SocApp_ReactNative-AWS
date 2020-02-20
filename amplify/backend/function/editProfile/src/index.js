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

const mutableUserEntityProperties = ['nickname', 'bio', 'avatar', 'username'];
const mutableUserPoolAttributes = ['nickname'];

const validateRequestBody = (body) =>
  !(Object.keys(body)).some(key => !mutableUserEntityProperties.includes(key))

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

const updateDynamodb = async (UserAttributes, body) => {
  const Key = {};
  primaryKeys.forEach(({ userPoolAttribute, dynamodbField }) => {
    Key[dynamodbField] = UserAttributes[userPoolAttribute];
  });

  const queryParams = { 
    TableName,
    Key,
    AttributeUpdates: (Object.keys(body)).reduce((acc, prop) => ({ ...acc,
      [prop]: {
        Action: 'PUT',
        Value: body[prop]
      }
    }), {})
  };
  
  return dynamoDb.update(queryParams).promise();
}

exports.handler = async (event, context) => {
  const UserAttributes = event.requestContext.authorizer.claims;
  const body = JSON.parse(event.body);
  
  if (!validateRequestBody(body)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Request body contain unexpected property.'
      })
    };
  }

  await Promise.all([
    updateUserPool(UserAttributes, body),
    updateDynamodb(UserAttributes, body),
  ]);

  return { statusCode: 200 };
};