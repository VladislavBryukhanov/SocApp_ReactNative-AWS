/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authSocAppMobileUserPoolId = process.env.AUTH_SOCAPPMOBILE_USERPOOLID

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');

AWS.config.update({ region: process.env.REGION });
const cisp = new AWS.CognitoIdentityServiceProvider();

exports.handler = function (event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;

  const { email, preferred_username } = event.request.userAttributes;

  if (email.toLowerCase() !== email) {
    return callback('Email must be lowercase');
  }

  const params = {
    UserPoolId: process.env.AUTH_SOCAPPMOBILE_USERPOOLID,
    Filter: `preferred_username="${preferred_username}"`
  };

  cisp.listUsers(params, (err, data) => {
    if (data.Users.length > 0) {
      callback('Such username already exists');
    } else {
      callback(null, event);
    }
  });
};
