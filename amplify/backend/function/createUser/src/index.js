/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk')

AWS.config.update({ region: process.env.TABLE_REGION });
const dynamodb = new AWS.DynamoDB.DocumentClient();

const params = {
  TableName: 'userList-env'
}

exports.handler = function (event, context, callback) {
  
  dynamodb.scan(params, (err, data) => {
    if (err) {
      console.log('ERROR');
      callback(err);
    }
    callback(null, data);
  });

  // return response;
};
