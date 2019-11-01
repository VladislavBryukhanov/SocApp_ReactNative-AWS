import { Dispatch } from "redux";
import { Auth, USER_IS_NOT_CONFIRMED_EXCEPTION, USER_ALREADY_EXISTS_EXCEPTION } from "../../api/auth";
import { Credentials } from "../../types/user";
import errorHandler from '../errorHandler';
import { SIGN_IN, SIGN_UP, CONFIRM_EMAIL, RESEND_CONFIRMATION_CODE } from "../action-types";

export const signIn = (credentials: Credentials, confirmationExceptionHandler?: Function): any => (
  async (dispatch: Dispatch) => {
    try {
      const user = await Auth.signIn(credentials);
      console.log(user);

      dispatch({
        type: SIGN_IN,
        payload: user
      });

      return true;
    } catch (err) {
      if (err.code === USER_IS_NOT_CONFIRMED_EXCEPTION) {
        confirmationExceptionHandler ? 
          confirmationExceptionHandler() : errorHandler(err);;
      } else {
        errorHandler(err);
      }
    }
  }
)

export const signUp = (credentials: Credentials, userExistsExceptionHandler?: Function): any => (
  async (dispatch: Dispatch) => {
    try {
      const { user } = await Auth.signUp(credentials);
      console.log(user);

      dispatch({
        type: SIGN_UP,
        payload: user
      });

      return true;
    } catch (err) {
      if (err.code === USER_ALREADY_EXISTS_EXCEPTION) {
        userExistsExceptionHandler ? 
          userExistsExceptionHandler() : errorHandler(err);
      } else {
        errorHandler(err);
      }
    }
  }
)

export const confirmEmail = (confirmationCode: string, credentials: Credentials): any => (
  async (dispatch: Dispatch) => {
    try {
      const res = await Auth.confirmEmail(confirmationCode, credentials);
      console.log(res);

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
      const res = await Auth.resendConfirmationCode(credentials);
      console.log(res);

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