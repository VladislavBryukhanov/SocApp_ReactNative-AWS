import AWS, { DynamoDB, AWSError } from 'aws-sdk';
import { promisify } from 'es6-promisify';
import { CognitoAuth } from './auth';
import awsmobile from '../../aws-exports';

export class DatabaseInstance {
  dynamoDb?: DynamoDB;

  async getDbInstance() {
    if (!this.dynamoDb) {
      const credentials = await CognitoAuth.getAwsConfigCredentials();
      AWS.config.credentials = new AWS.CognitoIdentityCredentials(credentials);
      AWS.config.update({ region: awsmobile.aws_project_region });
  
      this.dynamoDb = new AWS.DynamoDB({
        correctClockSkew: true
      });
    }

    return this.dynamoDb;
  }

  async scan(requestParams: DynamoDB.Types.ScanInput): Promise<DynamoDB.Types.ScanOutput> {
    const db = await this.getDbInstance();
    const scanDb = promisify(
      (
        params: DynamoDB.Types.ScanInput,
        callback: (
          err: AWSError,
          data: DynamoDB.Types.ScanOutput
        ) => void
      ) => db.scan(params, callback)
    );

    // const dynamodb = new AWS.DynamoDB.DocumentClient();

    const items = await scanDb(requestParams);
    return items;
  }

  async create(item: DynamoDB.Types.PutItemInput) {
    const db = await this.getDbInstance();
    const putItem = promisify(
      (
        params: DynamoDB.Types.PutItemInput,
        callback: (
          err: AWSError,
          data: DynamoDB.Types.ScanOutput
        ) => void
      ) => db.putItem(params, callback)
    );

    const items = await putItem(item);
    return items;
  }
}