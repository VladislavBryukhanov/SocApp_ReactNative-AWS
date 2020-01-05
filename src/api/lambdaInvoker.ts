import { InvocationResponse } from 'aws-sdk/clients/lambda';
import AWS, { AWSError, CognitoIdentityCredentials } from 'aws-sdk';
import { CognitoAuth } from '@api/auth';
import awsmobile from '../../aws-exports';
import { promisify } from 'es6-promisify';
import { AMPLIFY_ENV} from 'react-native-dotenv';

class LambdaInvoker {
  private _lambda?: AWS.Lambda;

  private async getLambdaInstance() {
    if (!this._lambda) {
      this._lambda = new AWS.Lambda({ correctClockSkew: true });
    }

    return this._lambda;
  }

  async invoke<T>(functionName: string) {
    const lambda = await this.getLambdaInstance();
    const params = {
      FunctionName: `${functionName}-${AMPLIFY_ENV}` 
    };
    
    const { Payload } = await lambda.invoke(params).promise();
    return Payload as T;
  }
}

export default new LambdaInvoker();