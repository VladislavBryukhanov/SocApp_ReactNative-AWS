import AWS, { DynamoDB, AWSError, CognitoIdentityCredentials } from 'aws-sdk';
import { promisify } from 'es6-promisify';
import { CognitoAuth } from './auth';
import awsmobile from '../../aws-exports';

// Experimental - insecure as directly db access
class DatabaseInstance {
  dynamoDb?: DynamoDB.DocumentClient;

  async getDbInstance() {
    if (!this.dynamoDb) {
      const credentials = await CognitoAuth.getAwsConfigCredentials();
      AWS.config.credentials = new CognitoIdentityCredentials(credentials);
      AWS.config.update({ region: awsmobile.aws_project_region });
  
      this.dynamoDb = new DynamoDB.DocumentClient({
        correctClockSkew: true
      });
    }

    return this.dynamoDb;
  }

  async scan(requestParams: DynamoDB.DocumentClient.ScanInput): Promise<DynamoDB.DocumentClient.ScanOutput> {
    const db = await this.getDbInstance();
    const scanDb = promisify((
        params: DynamoDB.DocumentClient.ScanInput,
        callback: (
          err: AWSError,
          data: DynamoDB.DocumentClient.ScanOutput
        ) => void
      ) => db.scan(params, callback)
    );

    return scanDb(requestParams);
  }

  async create(requestParams: DynamoDB.DocumentClient.PutItemInput) {
    const db = await this.getDbInstance();
    const putItem = promisify((
        params: DynamoDB.DocumentClient.PutItemInput,
        callback: (
          err: AWSError,
          data: DynamoDB.DocumentClient.PutItemOutput
        ) => void
      ) => db.put(params, callback)
    );

    await putItem(requestParams);
    return requestParams.Item;
  }
}

export default new DatabaseInstance();