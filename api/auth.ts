import { CognitoUserPool, CognitoUserAttribute, ISignUpResult, CognitoUser } from 'amazon-cognito-identity-js';
import errorHandler from '../store/errorHandler';
// import { promisify } from 'es6-promisify';

export class Auth {
  cognitoUser: any;

  async signUp(email: string, password: string): Promise<CognitoUser | undefined> {
    const poolData = {
      UserPoolId: 'us-east-1_0lmVJyP6m',
      ClientId: '550die4add4qtkaqql3eqce3cu'
    }

    const userPool = new CognitoUserPool(poolData);

    // const userData = {
    //   Username: 'app_client',
    //   Pool: poolData
    // };

    const attributeEmail = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    });
    
    const attributeList = [
      attributeEmail
    ];

    // const signUp = promisify(userPool.signUp);
    const signUpPromise = new Promise<ISignUpResult>((resolve, reject) => {
      userPool.signUp(email, password, attributeList, [], (err?: Error, res?: ISignUpResult) => {
        if (err) {
          reject(err);
        }
        resolve(res)
      })
    });

    try {
      const { user } = await signUpPromise;
      return user; 
    } catch (err) {
      errorHandler(err);
    }
    // this.confirmEmail(cognitoUser);
  }

  confirmEmail(confirmationCode: string) {
    this.cognitoUser.confirmRegistration(confirmationCode, true, (err, res) => {
      if (err) {
        return errorHandler(err);
      }
      console.log(res);
    })
  }
}