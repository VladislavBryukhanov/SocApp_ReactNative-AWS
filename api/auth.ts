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

const USER_IS_NOT_CONFIRMED = 'UserNotConfirmedException';

const poolData = {
  UserPoolId: 'us-east-1_0lmVJyP6m',
  ClientId: '550die4add4qtkaqql3eqce3cu'
};
const userPool = new CognitoUserPool(poolData);

export class Auth {
  static async signIn(credentials: Credentials) {
    const { email, password } = credentials;
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });

    const userData = {
      Username: email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);

    const signInPromise = new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: resolve,
        onFailure: reject,
        mfaRequired: () => reject('MFA required')
      });
    });

    try {
      const user = await signInPromise;
      return user;
    } catch (err) {
      if (err.code === USER_IS_NOT_CONFIRMED) {
        //..todo
      }
      errorHandler(err)
    }
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

  static confirmEmail(confirmationCode: string, credentials: Credentials) {
    const userData = {
      Username: credentials.email,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    
    cognitoUser.confirmRegistration(confirmationCode, true, (err, res) => {
      if (err) {
        return errorHandler(err);
      }
      console.log(res);
    })
  }
}