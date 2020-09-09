/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN

Amplify Params - DO NOT EDIT */
const UsersDB = require('/opt/nodejs/db-utils');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const SNS = new AWS.SNS();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const PlatformApplicationArn = process.env.SNS_APPLICATION_ARN;
const TableName = process.env.STORAGE_USERLIST_NAME;
const TopicArn = process.env.SNS_MSG_TOPIC_ARN;

exports.handler = async (event) => {
    const { notificationToken } = JSON.parse(event.body);
    const db = new UsersDB(dynamoDb, TableName, event);
    const user = await db.fetchUserProfile();

    if (user.snsCreds && user.snsCreds.notificationToken === notificationToken) {
        return { statusCode: 204 };
    }

    const promises = [];

    const { EndpointArn } = await SNS.createPlatformEndpoint({
        Token: notificationToken,
        PlatformApplicationArn,
    }).promise();

    promises.push(
        SNS.subscribe({
            Protocol: 'application',
            TopicArn,
            Endpoint: EndpointArn
        }).promise()
    );

    if (user.snsCreds) {
        const { EndpointArn, SubscriptionArn } = user.snsCreds;

        promises.push(
            SNS.unsubscribe({ SubscriptionArn }).promise(),
            SNS.deleteEndpoint({ EndpointArn }).promise(),
        );
    }

    const [{ SubscriptionArn }] = await Promise.all(promises);

    await db.updateDynamodbTable({
        snsCreds: { notificationToken, EndpointArn, SubscriptionArn }
    });

    return { 
        statusCode: 200,
        body: JSON.stringify({ notificationToken, EndpointArn, SubscriptionArn })
     };
};
