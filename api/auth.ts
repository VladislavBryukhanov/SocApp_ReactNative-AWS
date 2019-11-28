import {
  CognitoUserPool,
  CognitoUserAttribute,
  ISignUpResult,
  CognitoUser,
  AuthenticationDetails,
  NodeCallback,
  CognitoUserSession
} from 'amazon-cognito-identity-js';
import { Credentials } from '../types/user';
import { promisify } from 'es6-promisify';
import awsmobile from '../aws-exports';
import { CognitoIdentityCredentials } from 'aws-sdk';

interface ISignInResult {
  session: CognitoUserSession,
  userConfirmationNecessary?: boolean
}

export const USER_IS_NOT_CONFIRMED_EXCEPTION = 'UserNotConfirmedException';
export const USER_ALREADY_EXISTS_EXCEPTION = 'UsernameExistsException';

const poolData = {
  UserPoolId: awsmobile.aws_user_pools_id,
  ClientId: awsmobile.aws_user_pools_web_client_id
};
const userPool = new CognitoUserPool(poolData);

export class CognitoAuth {
  private static initCognitoUser(email: string): CognitoUser {
    const userData = {
      Username: email,
      Pool: userPool
    };
    return new CognitoUser(userData);
  }

  static async getAwsConfigCredentials(): Promise<CognitoIdentityCredentials.CognitoIdentityOptions | undefined> {
    const awsIdentityLogin = `cognito-idp.${awsmobile.aws_cognito_region}.amazonaws.com/${awsmobile.aws_user_pools_id}`;

    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      const getSession = promisify(
        (callback) => cognitoUser.getSession(callback)
      );
      const session = await getSession();
      if (session instanceof CognitoUserSession) {
        return {
          IdentityPoolId: awsmobile.aws_cognito_identity_pool_id,
          Logins: {
            [awsIdentityLogin]: session.getIdToken().getJwtToken()
          }
        }
      }
    }
  }

  static async retrieveAuthenticatedUser(): Promise<CognitoUser> {
    const syncStorage = promisify(userPool.storage.sync);
    await syncStorage();

    const cognitoUser = userPool.getCurrentUser();
    return cognitoUser!;
  }

  static signIn(credentials: Credentials): Promise<ISignInResult> {
    const { email, password } = credentials;
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    const cognitoUser = this.initCognitoUser(email);

    const signInPromise = new Promise((resolve: (session: ISignInResult) => void, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session: CognitoUserSession, userConfirmationNecessary?: boolean) =>
          resolve({session, userConfirmationNecessary}),
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