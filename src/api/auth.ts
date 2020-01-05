import AWS, { CognitoIdentityCredentials } from 'aws-sdk';
import {
  CognitoUserPool,
  CognitoUserAttribute,
  ISignUpResult,
  CognitoUser,
  AuthenticationDetails,
  NodeCallback,
  CognitoUserSession
} from 'amazon-cognito-identity-js';
import { Credentials, UserAttributes } from '@models/user';
import { promisify } from 'es6-promisify';
import awsconfig from '../../aws-exports';
import { 
  AWSCredentialsResult,
  SignInResult,
  ForgotPasswordResult
} from '@models/auth';

const {
  aws_user_pools_id,
  aws_user_pools_web_client_id,
  aws_cognito_region,
  aws_cognito_identity_pool_id,
  aws_project_region
} = awsconfig;

export const USER_IS_NOT_CONFIRMED_EXCEPTION = 'UserNotConfirmedException';
export const USER_ALREADY_EXISTS_EXCEPTION = 'UsernameExistsException';
export const USER_VALIDATION_EXCEPTION = 'UserLambdaValidationException';

const poolData = {
  UserPoolId: aws_user_pools_id,
  ClientId: aws_user_pools_web_client_id
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

  private static async getAwsConfigCredentials(): Promise<AWSCredentialsResult> {
    const awsIdentityLogin = `cognito-idp.${aws_cognito_region}.amazonaws.com/${aws_user_pools_id}`;
    const credentials: AWSCredentialsResult = {
      IdentityPoolId: aws_cognito_identity_pool_id
    };

    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      const getSession = promisify(
        (callback) => cognitoUser.getSession(callback)
      );
      const session = await getSession();

      if (session instanceof CognitoUserSession) {
        credentials.Logins = {
          [awsIdentityLogin]: session.getIdToken().getJwtToken()
        }
      }
    }
    return credentials;
  }

  static async updateAWSConfig() {
    const credentials = await this.getAwsConfigCredentials();

    AWS.config.credentials = new CognitoIdentityCredentials(credentials);
    AWS.config.update({ region: aws_project_region });
  }

  static async retrieveAuthenticatedUser(): Promise<CognitoUser | undefined > {
    const sync = promisify(userPool.storage.sync);
    await sync();

    const cognitoUser = userPool.getCurrentUser();
    return cognitoUser!;
  }

  static signIn(credentials: Credentials): Promise<SignInResult | undefined> {
    const { email, password } = credentials;
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    });
    const cognitoUser = this.initCognitoUser(email);

    const signInPromise = new Promise((
      resolve: (payload: SignInResult) => void,
      reject
    ) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (
          session: CognitoUserSession,
          userConfirmationNecessary?: boolean
        ) => resolve({session, userConfirmationNecessary}),
        onFailure: reject,
        mfaRequired: () => reject('MFA required')
      });
    });

    return signInPromise;
  }

  static signUp(
    { email, password }: Credentials,
    { nickname, username }: UserAttributes
  ): Promise<ISignUpResult | undefined> {

    const attributes: CognitoUserAttribute[] = [
      new CognitoUserAttribute({
        Name: 'nickname',
        Value: nickname
      }),
      new CognitoUserAttribute({
        Name: 'preferred_username',
        Value: username
      }),
      new CognitoUserAttribute({
        Name: 'email',
        Value: email
      })
    ];

    const signUp = promisify((
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

    return signUp(email, password, attributes, []);
  }

  static signOut() {
    const cognitoUser = userPool.getCurrentUser();
    if (cognitoUser) {
      cognitoUser.signOut();
    }
  }

  static confirmEmail(
    confirmationCode: string,
    email: string
  ): Promise<'SUCCESS' | undefined> {
    const cognitoUser = this.initCognitoUser(email);
    const confirmRegistration = promisify((
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

  static resendConfirmationCode(email: string): Promise<'SUCCESS' | undefined> {
    const cognitoUser = this.initCognitoUser(email);
    const resendConfirmationCode = promisify(
      (callback: NodeCallback<Error, 'SUCCESS'>) => 
        cognitoUser.resendConfirmationCode(callback)
    );

    return resendConfirmationCode();
  }

  static forgotPassword(
    email: string,
    onCompletedCb?: (data: any) => void
  ): Promise<ForgotPasswordResult | undefined> {
    const cognitoUser = this.initCognitoUser(email);
    const signInPromise = new Promise((
      resolve: (data: ForgotPasswordResult) => void,
      reject
    ) => {
      cognitoUser.forgotPassword({
        inputVerificationCode: resolve,
        // onSuccess unused, as it will be call only after confirmNewPassword() success
        onSuccess: onCompletedCb!,
        onFailure: reject,
      })
    });

    return signInPromise;
  }

  static confirmNewPassword(
    email: string,
    verificationCode: string,
    newPassword: string
  ): Promise<undefined> {
    const cognitoUser = this.initCognitoUser(email);
    const confirmationPromise = new Promise((resolve, reject) =>
      cognitoUser.confirmPassword(
        verificationCode,
        newPassword, {
          onSuccess: resolve,
          onFailure: reject,
        })
      );
      
    return confirmationPromise;
  }
}