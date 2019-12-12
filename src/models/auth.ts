import { CognitoIdentityCredentials } from 'aws-sdk';
import { CognitoUserSession } from 'amazon-cognito-identity-js';

export type SignInResult = {
  session: CognitoUserSession,
  userConfirmationNecessary?: boolean
}

export type AWSCredentialsResult = CognitoIdentityCredentials.CognitoIdentityOptions | undefined;

export interface ForgotPasswordResult {
  CodeDeliveryDetails: {
    AttributeName: string;
    DeliveryMedium: string;
    Destination: string;
  }
}