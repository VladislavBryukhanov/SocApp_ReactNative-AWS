/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN
var storageMessagesName = process.env.STORAGE_MESSAGES_NAME
var storageMessagesArn = process.env.STORAGE_MESSAGES_ARN

Amplify Params - DO NOT EDIT */
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });
const SNS = new AWS.SNS();
const dynamodb = new AWS.DynamoDB.DocumentClient();

const MESSAGE_RECEIVED_TAG = 'message-received';
const TopicArn = process.env.SNS_MSG_TOPIC_ARN;
const TableName = process.env.STORAGE_USERLIST_NAME;

exports.handler = async event => {
    const record = event.Records.find(({ eventName }) => eventName === 'INSERT');

    if (!record) return;

    const { createdAt, senderId, content, chatId, id } = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
    
    const { Item: sender } = await dynamodb.get({
        TableName,
        Key: { id: senderId },
    }).promise();

    const notificationPayload = {
        data: {
            tag: MESSAGE_RECEIVED_TAG,
            messageId: id,
            message: content,
            chatId,
            createdAt,
            sender
        },
        priority: 'high'
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
    
    return SNS.publish(params).promise();
};
