/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var authSocAppMobileUserPoolId = process.env.AUTH_SOCAPPMOBILE_USERPOOLID

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const cisp = new AWS.CognitoIdentityServiceProvider();
const UserPoolId = process.env.AUTH_SOCAPPMOBILE_USERPOOLID;
const USER_TTL = 24 * 60 * 60 * 1000;

const isTimeToLiveExpired = (userCreatedAt) => {
  const diff = new Date() - new Date(userCreatedAt);
  
  return diff >= USER_TTL;
}

exports.handler = async function () {
  const params = {
    UserPoolId,
    Filter: 'cognito:user_status="UNCONFIRMED"'
  };
  
  const data = await cisp.listUsers(params).promise();
  const promises = [];

  data.Users.forEach(({ Username, UserCreateDate }) => {
    if (isTimeToLiveExpired(UserCreateDate)) {
      promises.push(
        cisp.adminDeleteUser({ UserPoolId, Username }).promise()
      );
    }
  });
  return Promise.all(promises);
};
