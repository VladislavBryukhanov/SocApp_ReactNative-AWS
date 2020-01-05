/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN

Amplify Params - DO NOT EDIT */

const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const customAttributePrefix = 'custom:';
const targetTriggerSource = 'PostConfirmation_ConfirmSignUp';

let tableName = "userList";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = `${tableName}-${process.env.ENV}`;
}

exports.handler = function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const { triggerSource, request: { userAttributes } } = event;

  if (triggerSource !== targetTriggerSource) {
    return callback(null, event);
  }

  const userItem = Object.keys(userAttributes).reduce((acc, attribute) => {
    if (attribute.includes(customAttributePrefix)) {
      const key = attribute.slice(customAttributePrefix.length);

      return {
        ...acc,
        [key]: userAttributes[attribute]
      }
    }

    return acc;
  }, {});

  const queryParams = {
    TableName: tableName,
    Item: {
      id: uuidv4(),
      ...userItem
    }
  };

  dynamodb.put(queryParams, (err, data) => callback(err, event));
};
