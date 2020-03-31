/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageMessagesName = process.env.STORAGE_MESSAGES_NAME
var storageMessagesArn = process.env.STORAGE_MESSAGES_ARN

Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
const SNS = new AWS.SNS();

const MESSAGE_RECEIVED_TAG = 'message-received';
const TopicArn = process.env.SNS_MSG_TOPIC_ARN;

exports.handler = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    event.Records.forEach(record => {
        if (record.eventName == 'INSERT') {
            const { createdAt, senderId, content } = record.dynamodb.NewImage;
            
            const notificationPayload = {
                data: {
                    tag: MESSAGE_RECEIVED_TAG,
                    bigText: content.S,
                    message: content.S, 
                    title: senderId.S,                   
                }
            };
            
            const message = JSON.stringify({ 
                GCM: JSON.stringify(notificationPayload),
                default: JSON.stringify(notificationPayload)
            });
            
            const params = {
                MessageStructure: 'json',
                Message: message,
                TopicArn,
            };
            
            SNS.publish(params, callback);   
        }

    })
};
