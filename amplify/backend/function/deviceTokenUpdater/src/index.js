/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN

Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const SNS = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const PlatformApplicationArn = process.env.SNS_APPLICATION_ARN;
const TableName = process.env.STORAGE_USERLIST_NAME;
const TopicArn = process.env.SNS_MSG_TOPIC_ARN;

exports.handler = async (event) => {
    const { sub: id, preferred_username: username } = event.requestContext.authorizer.claims;
    const { notificationToken } = JSON.parse(event.body);

    const user = await dynamodb.get({
        TableName,
        Key: { id, username },
    }).promise();

    if ((user.snsCreds && user.snsCreds.notificationToken === notificationToken)) {
        return { statusCode: 304 };
    }

    const promises = [];

    const { EndpointArn } = await SNS.createPlatformEndpoint({
        Token: notificationToken,
        PlatformApplicationArn,
    }).promise()

    promises.push(
        SNS.subscribe({
            Protocol: 'application',
            TopicArn,
            Endpoint: EndpointArn
        })
        .promise()
        .then(({ ResponseMetadata: { SubscriptionArn } }) => SubscriptionArn)
    );

    if (user.snsCreds) {
        const { EndpointArn, SubscriptionArn } = user.snsCreds;

        promises.push(SNS.deleteEndpoint({ EndpointArn }).promise());
        promises.push(SNS.unsubscribe({ SubscriptionArn }).promise());
    }

    const [SubscriptionArn] = await Promise.all(promises);
    
    await dynamodb.update({
        TableName,
        Key: { id, username },
        AttributeUpdates: { 
            snsCreds: {
                Action: 'PUT',
                Value: { notificationToken, EndpointArn, SubscriptionArn },
            }
        }
    }).promise();

    return { 
        statusCode: 200,
        body: JSON.stringify({ notificationToken, EndpointArn, SubscriptionArn })
     };
};
