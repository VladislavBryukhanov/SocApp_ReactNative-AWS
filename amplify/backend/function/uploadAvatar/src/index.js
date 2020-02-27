/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var storageUserListName = process.env.STORAGE_USERLIST_NAME
var storageUserListArn = process.env.STORAGE_USERLIST_ARN
var storageMediaResourcesBucketName = process.env.STORAGE_MEDIARESOURCES_BUCKETNAME

Amplify Params - DO NOT EDIT */

const UsersDB = require('/opt/nodejs/db-utils');
const uuidv4 = require('uuid/v4');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const bucketName = process.env.STORAGE_MEDIARESOURCES_BUCKETNAME;
const TableName = process.env.STORAGE_USERLIST_NAME;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const AVATAR_DB_KEY = 'avatar'

const storage = new AWS.S3({
  signatureVersion: 'v4',
  params: { Bucket: bucketName }
});

const RESOURCE_TYPE = 'image/';
const SUPPORTED_FILE_TYPES = ['png', 'jpeg'];

const validateFileType = (fileType) => SUPPORTED_FILE_TYPES.some(
  type => type === fileType.split(RESOURCE_TYPE)[1]
);

exports.handler = async (event) => {
  const { base64File, fileType, extension } = JSON.parse(event.body);

  if (!(base64File && extension && fileType && validateFileType(fileType))) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid file format or request signature'
      })
    }
  }

  const buff = Buffer.from(base64File, 'base64');
  const objectKey = `${uuidv4()}.${extension}`;

  const options = {
    Key: objectKey,
    Body: buff,
    ContentType: fileType
  };

  const db = new UsersDB(dynamoDb, TableName, event);
  
  try {
    const { avatar } = await db.fetchUserProfile();

    await Promise.all([
      storage.deleteObject({ Key: avatar }).promise(),
      storage.putObject(options).promise(),
      db.updateDynamodbTable({ [AVATAR_DB_KEY]: objectKey })
    ]);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: err })
    };
  }
  
  return {
    statusCode: 200,
    body: JSON.stringify({ s3Key: objectKey })
  };
};
