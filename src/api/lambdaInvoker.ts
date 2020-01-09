import AWS from 'aws-sdk';
import { AMPLIFY_ENV} from 'react-native-dotenv';
import { InvocationRequest } from 'aws-sdk/clients/lambda';

class LambdaInvoker {
  private _lambda?: AWS.Lambda;

  private async getLambdaInstance() {
    if (!this._lambda) {
      this._lambda = new AWS.Lambda({ correctClockSkew: true });
    }

    return this._lambda;
  }

  async invoke<T>(
    functionName: string,
    invokationParams?: Partial<InvocationRequest>
  ) {
    const lambda = await this.getLambdaInstance();
    const params = {
      FunctionName: `${functionName}-${AMPLIFY_ENV}`,
      ...invokationParams
    };
    
    const { Payload } = await lambda.invoke(params).promise();
    return Payload as T;
  }
}

export default new LambdaInvoker();