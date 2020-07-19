import { fetchProfile } from '@store/users/users.actions';
import { AppState } from '@store/index';
import { Dispatch } from "redux";
import { 
  CognitoAuth,
  USER_IS_NOT_CONFIRMED_EXCEPTION,
  USER_ALREADY_EXISTS_EXCEPTION,
  USER_VALIDATION_EXCEPTION
} from "@api/auth";
import { Credentials, UserAttributes } from "@models/user";
import { ForgotPasswordResult } from '@models/auth';
import messaging from '@react-native-firebase/messaging';
import errorHandler from '@store/errorHandler';
import { 
  SIGN_IN,
  SIGN_UP,
  AUTH_CHECKED,
  SIGN_OUT,
  FORGOT_PASSWORD
} from "@store/action-types";

export const retrieveAuthenticatedUser = (): any => (
  async (dispatch: Dispatch) => {
    try {
      const user = await CognitoAuth.retrieveAuthenticatedUser();

      if (!user) return;

      const cognitoUsername = user && user.getUsername();
      await CognitoAuth.updateAWSConfig();
      
      dispatch({
        type: AUTH_CHECKED,
        payload: {
          cognitoUsername,
          isAuthenticated: !!user
        }
      });

      return dispatch(fetchProfile());
    } catch (err) {
      errorHandler(err, 'retrieveAuthenticatedUser');
    }
  }
)

export const signIn = (
  credentials: Credentials,
  confirmationExceptionHandler?: Function
): any => (
  async (dispatch: Dispatch) => {
    try {
      const payload = await CognitoAuth.signIn(credentials);
      const { 'cognito:username': cognitoUsername } = payload!.session
        .getIdToken()
        .decodePayload();

      await CognitoAuth.updateAWSConfig();

      dispatch({
        type: SIGN_IN,
        payload: {
          cognitoUsername,
          isAuthenticated: !!payload,
          email: credentials.email
        }
      });

      return dispatch(fetchProfile());
    } catch (err) {
      if (err.code === USER_IS_NOT_CONFIRMED_EXCEPTION) {
        confirmationExceptionHandler 
          ? confirmationExceptionHandler()
          : errorHandler(err, 'signIn');
      } else {
        errorHandler(err, 'signIn');
      }
    }
  }
)

export const signUp = (
  credentials: Credentials,
  userAttributes: UserAttributes,
  userExistsExceptionHandler?: Function
): any => (
  async (dispatch: Dispatch) => {
    try {
      await CognitoAuth.signUp(credentials, userAttributes);

      dispatch({
        type: SIGN_UP,
        payload: {
          email: credentials.email
        }
      });

      return true;
    } catch (err) {
      switch(err.code) {
        case USER_VALIDATION_EXCEPTION: {
          const errorPrefix = 'PreSignUp failed with error ';
          const error = {
            ...err,
            message: err.message.slice(errorPrefix.length)
          };

          return errorHandler(error, 'signUp')
        }
        case USER_ALREADY_EXISTS_EXCEPTION: {
          return userExistsExceptionHandler
            ? userExistsExceptionHandler()
            : errorHandler(err, 'signUp');
        }
        default: {
          return errorHandler(err, 'signUp');
        }
      }
    }
  }
)

export const signOut = (): any => (
  async (dispatch: Dispatch) => {
    try {
      await messaging().deleteToken();

      CognitoAuth.signOut();

      dispatch({ type: SIGN_OUT });
    } catch (err) {
      errorHandler(err, 'signOut');
    }
  }
)

export const confirmEmail = (confirmationCode: string): any => (
  async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const { authModule: { email } } = getState();

      await CognitoAuth.confirmEmail(confirmationCode, email!);

      return true;
    } catch (err) {
      errorHandler(err, 'confirmEmail');
    }
  }
)

export const resendConfirmationCode = (): any => (
  async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const { authModule: { email } } = getState();

      await CognitoAuth.resendConfirmationCode(email!);

      return true;
    } catch (err) {
      errorHandler(err, 'resendConfirmationCode');
    }
  }
)

export const forgotPassword = (
  email: string,
  onCompletedCb?: (data: any) => void
): any => (
  async (dispatch: Dispatch): Promise<ForgotPasswordResult | undefined> => {
    try {
      const result = await CognitoAuth.forgotPassword(email, onCompletedCb);

      dispatch({
        type: FORGOT_PASSWORD,
        payload: { email }
      });

      return result;
    } catch (err) {
      errorHandler(err, 'forgotPassword');
    }
  }
)

export const confirmNewPassword = (
  verificationCode: string,
  newPassword: string
): any => (
  async (dispatch: Dispatch, getState: () => AppState): Promise<boolean | undefined> => {
    try {
      const { authModule: { email } } = getState();

      await CognitoAuth.confirmNewPassword(
        email!,
        verificationCode,
        newPassword
      );

      return true;
    } catch (err) {
      errorHandler(err, 'confirmNewPassword');
    }
  }
)