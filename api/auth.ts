import {
  CognitoUserPool,
  CognitoUserAttribute,
  ISignUpResult,
  CognitoUser,
  AuthenticationDetails,
  NodeCallback
} from 'amazon-cognito-identity-js';
import { Credentials } from '../types/user';
import { promisify } from 'es6-promisify';

export const USER_IS_NOT_CONFIRMED_EXCEPTION = 'UserNotConfirmedException';
export const USER_ALREADY_EXISTS_EXCEPTION = 'UsernameExistsException';

const poolData = {
  UserPoolId: 'us-east-1_0lmVJyP6m',
  ClientId: '550die4add4qtkaqql3eqce3cu'
};
const userPool = new CognitoUserPool(poolData);

export class Auth {
  static initCognitoUser(email: string) {
    const userData = {
      Username: email,
      Pool: userPool
    };
    return new CognitoUser(userData);
  }

  static signIn(credentials: Credentials) {
    const { email, password } = credentials;
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    const cognitoUser = this.initCognitoUser(email);

    const signInPromise = new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: resolve,
        onFailure: reject,
        mfaRequired: () => reject('MFA required')
      });
    });

    return signInPromise;
  }

  static signUp(credentials: Credentials): Promise<ISignUpResult> {
    const { email, password } = credentials;

    const attributeEmail = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    });
    const attributeList = [
      attributeEmail
    ];

    const signUp = promisify(
      (
        username: string,
        password: string,
        userAttributes: CognitoUserAttribute[],
        validationData: CognitoUserAttribute[],
        callback: NodeCallback<Error, ISignUpResult>
      ) => userPool.signUp(
        username,
        password,
        userAttributes,
        validationData,
        callback
      )
    );

    return signUp(email, password, attributeList, []);
  }

  static confirmEmail(confirmationCode: string, credentials: Credentials) {
    const cognitoUser = this.initCognitoUser(credentials.email);
    const confirmRegistration = promisify(
      (
        code: string,
        forceAliasCreation: boolean,
        callback: NodeCallback<any, any>
      ) => cognitoUser.confirmRegistration(
        code,
        forceAliasCreation,
        callback,
      )
    );

    return confirmRegistration(confirmationCode, true);
  }

  static resendConfirmationCode(credentials: Credentials) {
    const cognitoUser = this.initCognitoUser(credentials.email);
    const resendConfirmationCode = promisify(
      (callback: NodeCallback<Error, 'SUCCESS'>) => 
        cognitoUser.resendConfirmationCode(callback)
    );

    return resendConfirmationCode();
  }

  //TODO
  static forgotPassword(credentials: Credentials) {
    const cognitoUser = this.initCognitoUser(credentials.email);
    const signInPromise = new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: resolve,
        onFailure: reject,
        inputVerificationCode() {
          // var verificationCode = prompt('Please input verification code ' ,'');
          // var newPassword = prompt('Enter new password ' ,'');
          // cognitoUser.confirmPassword(verificationCode, newPassword, this);
        }
      })
    });
    return signInPromise;
  }
}