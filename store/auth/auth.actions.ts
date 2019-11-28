import { Dispatch } from "redux";
import { 
  CognitoAuth,
  USER_IS_NOT_CONFIRMED_EXCEPTION,
  USER_ALREADY_EXISTS_EXCEPTION
} from "../../api/auth";
import { Credentials } from "../../types/user";
import errorHandler from '../errorHandler';
import { 
  SIGN_IN,
  SIGN_UP,
  CONFIRM_EMAIL,
  RESEND_CONFIRMATION_CODE,
  AUTH_CHECKED
} from "../action-types";

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

export const signIn = (credentials: Credentials, confirmationExceptionHandler?: Function): any => (
  async (dispatch: Dispatch) => {
    try {
      const user = await CognitoAuth.signIn(credentials);

      dispatch({
        type: SIGN_IN,
        payload: {
          isAuthenticated: !!user
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

export const signUp = (credentials: Credentials, userExistsExceptionHandler?: Function): any => (
  async (dispatch: Dispatch) => {
    try {
      const { user } = await CognitoAuth.signUp(credentials);

      dispatch({
        type: SIGN_UP,
        payload: {
          isAuthenticated: !!user
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

export const confirmEmail = (confirmationCode: string, credentials: Credentials): any => (
  async (dispatch: Dispatch) => {
    try {
      const res = await CognitoAuth.confirmEmail(confirmationCode, credentials);

      dispatch({
        type: CONFIRM_EMAIL,
        payload: res
      });

      return true;
    } catch (err) {
      errorHandler(err);
    }
  }
)

export const resendConfirmationCode = (credentials: Credentials): any => (
  async (dispatch: Dispatch) => {
    try {
      const res = await CognitoAuth.resendConfirmationCode(credentials);

      dispatch({
        type: RESEND_CONFIRMATION_CODE,
        payload: res
      });

      return true;
    } catch (err) {
      errorHandler(err);
    }
  }
)

export const forgotPassword = (credentials: Credentials): any => (
  async (dispatch: Dispatch) => {

  }
)