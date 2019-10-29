import {
  CognitoUserPool,
  CognitoUserAttribute,
  ISignUpResult,
  CognitoUser,
  AuthenticationDetails
} from 'amazon-cognito-identity-js';
import errorHandler from '../store/errorHandler';
import { Credentials } from '../types/user';
// import { promisify } from 'es6-promisify';

const poolData = {
  UserPoolId: 'us-east-1_0lmVJyP6m',
  ClientId: '550die4add4qtkaqql3eqce3cu'
};
const userPool = new CognitoUserPool(poolData);
const userData = {
  Username: 'app_client',
  Pool: userPool
};

export class Auth {
  cognitoUser: any;

  static async signIn(credentials: Credentials) {
    const { email, password } = credentials;

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (res) => console.log(res),
      onFailure: errorHandler,
      mfaRequired: () => console.log('MFA required')
    })
  }

  static async signUp(credentials: Credentials): Promise<CognitoUser | undefined> {
    const { email, password } = credentials;

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
        resolve(res);
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

  static confirmEmail(confirmationCode: string) {
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(confirmationCode, true, (err, res) => {
      if (err) {
        return errorHandler(err);
      }
      console.log(res);
    })
  }
}