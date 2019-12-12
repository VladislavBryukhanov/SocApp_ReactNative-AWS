import { AppState } from '@store/index';
import { Dispatch } from "redux";
import { 
  CognitoAuth,
  USER_IS_NOT_CONFIRMED_EXCEPTION,
  USER_ALREADY_EXISTS_EXCEPTION
} from "@api/auth";
import { Credentials } from "@models/user";
import { ForgotPasswordResult } from '@models/auth';
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

      dispatch({
        type: AUTH_CHECKED,
        payload: {
          isAuthenticated: !!user
        }
      });

      return user;
    } catch (err) {
      errorHandler(err);
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

      dispatch({
        type: SIGN_IN,
        payload: {
          isAuthenticated: !!payload
        }
      });

      return true;
    } catch (err) {
      if (err.code === USER_IS_NOT_CONFIRMED_EXCEPTION) {
        confirmationExceptionHandler 
          ? confirmationExceptionHandler()
          : errorHandler(err);
      } else {
        errorHandler(err);
      }
    }
  }
)

export const signUp = (
  credentials: Credentials,
  userExistsExceptionHandler?: Function
): any => (
  async (dispatch: Dispatch) => {
    try {
      const payload = await CognitoAuth.signUp(credentials);

      dispatch({
        type: SIGN_UP,
        payload: {
          isAuthenticated: !!payload
        }
      });

      return true;
    } catch (err) {
      if (err.code === USER_ALREADY_EXISTS_EXCEPTION) {
        userExistsExceptionHandler 
          ? userExistsExceptionHandler()
          : errorHandler(err);
      } else {
        errorHandler(err);
      }
    }
  }
)

export const signOut = (): any => (
  (dispatch: Dispatch) => {
    try {
      CognitoAuth.signOut();
      dispatch({ type: SIGN_OUT });
    } catch (err) {
      errorHandler(err);
    }
  }
)

export const confirmEmail = (
  confirmationCode: string,
  credentials: Credentials
): any => (
  async (dispatch: Dispatch) => {
    try {
      await CognitoAuth.confirmEmail(confirmationCode, credentials.email);
      
      // dispatch({
      //   type: CONFIRM_EMAIL,
      //   payload: res
      // });

      return true;
    } catch (err) {
      errorHandler(err);
    }
  }
)

export const resendConfirmationCode = (credentials: Credentials): any => (
  async (dispatch: Dispatch) => {
    try {
      await CognitoAuth.resendConfirmationCode(credentials.email);

      // dispatch({
      //   type: RESEND_CONFIRMATION_CODE,
      //   payload: res
      // });

      return true;
    } catch (err) {
      errorHandler(err);
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
      errorHandler(err);
    }
  }
)

export const confirmNewPassword = (
  verificationCode: string,
  newPassword: string
): any => (
  async (dispatch: Dispatch, getState: () => AppState): Promise<boolean | undefined> => {
    const { authModule: { email } } = getState();

    try {
      await CognitoAuth.confirmNewPassword(
        email!,
        verificationCode,
        newPassword
      );

      return true;
    } catch (err) {
      errorHandler(err);
    }
  }
)