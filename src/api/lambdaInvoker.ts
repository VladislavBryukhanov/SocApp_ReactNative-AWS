import { InvocationResponse } from 'aws-sdk/clients/lambda';
import AWS, { AWSError, CognitoIdentityCredentials } from 'aws-sdk';
import { CognitoAuth } from '@api/auth';
import awsmobile from '../../aws-exports';
import { promisify } from 'es6-promisify';
import { AMPLIFY_ENV} from 'react-native-dotenv';

type LambdaResultCb = (err: AWSError, data: InvocationResponse) => void;
type LambdaFunctionName = 'listUsers' | 'createUser';

class LambdaInvoker {
  private _lambda?: AWS.Lambda;

  private async getLambdaInstance() {
    if (!this._lambda) {
      const credentials = await CognitoAuth.getAwsConfigCredentials();

      AWS.config.credentials = new CognitoIdentityCredentials(credentials);
      AWS.config.update({ region: awsmobile.aws_project_region });

      this._lambda = new AWS.Lambda({ correctClockSkew: true });
    }

    return this._lambda;
  }

  async invoke<T>(functionName: LambdaFunctionName) {
    const lambda = await this.getLambdaInstance();
    const params = {
      FunctionName: `${functionName}-${AMPLIFY_ENV}` 
    };
    
    const lambdaResult = promisify(
      (callback: LambdaResultCb) => lambda.invoke(params, callback)
    );

    const { Payload } = await lambdaResult();
    return Payload as T;
  }
}

export default new LambdaInvoker();