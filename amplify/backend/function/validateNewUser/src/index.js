/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authSocAppMobileUserPoolId = process.env.AUTH_SOCAPPMOBILE_USERPOOLID

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const cisp = new AWS.CognitoIdentityServiceProvider();

exports.handler = async function (event) {
  const { email, preferred_username } = event.request.userAttributes;

  if (email.toLowerCase() !== email) {
    throw Error('Email must be lowercase');
  }

  const params = {
    UserPoolId: process.env.AUTH_SOCAPPMOBILE_USERPOOLID,
    Filter: `preferred_username="${preferred_username}"`
  };

  const data = await cisp.listUsers(params).promise();

  if (data.Users.length) {
    throw Error('Such username already exists');
  }

  return event;
};
