/* Amplify Params - DO NOT EDIT
  STORAGE_MEDIARESOURCES_BUCKETNAME
Amplify Params - DO NOT EDIT */
const aws4 = require('aws4');
const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.REGION });

const s3Host = `${process.env.STORAGE_MEDIARESOURCES_BUCKETNAME}.s3.amazonaws.com`;

const endpoint = new AWS.Endpoint(s3Host);
const client = new AWS.HttpClient();
const credentials = new AWS.EnvironmentCredentials('AWS');

// TODO image resizing

// Implementation could be replaced with s3.getObject()
exports.handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // TODO check has user acces to resource
  // const user = event.requestContext.authorizer.claims;
  const { s3Key } = event.pathParameters;
  const endpointPath = `/${s3Key}`;

  const request = new AWS.HttpRequest(endpoint, process.env.REGION);
  request.method = 'GET';
  request.path = endpointPath;

  // const signer = new AWS.Signers.V4(request, 's3');
  // signer.addAuthorization(credentials, new Date());

  const opts = {
    service: 's3',
    region: process.env.REGION,
    host: s3Host,
    path: endpointPath,
  };
  const res = aws4.sign(opts, credentials);
  request.headers = res.headers;

  // request.headers['Authorization'] = res.headers['Authorization'];
  // request.headers['X-Amz-Content-Sha256'] = res.headers['X-Amz-Content-Sha256'];
  // request.headers['X-Amz-Date'] = res.headers['X-Amz-Date'];

  client.handleRequest(request, null, function (response) {
    const responseBody = [];

    response.on('data', (chunk) => responseBody.push(chunk));

    response.on('end', () => {
      if (response.statusCode >= 200 && response.statusCode <= 300) {
        const result = {
          statusCode: response.statusCode,
          body: Buffer.concat(responseBody).toString('base64'),
          isBase64Encoded: true,
        };

        return callback(null, result);
      }

      if (response.statusCode >= 400 && response.statusCode <= 500) {
        callback(responseBody);
      }
    });
  }, err => callback(err));
};
