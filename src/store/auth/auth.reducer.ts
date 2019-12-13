import { handleActions } from 'redux-actions';
import { Action } from "redux";
import { 
  AUTH_CHECKED,
  SIGN_IN,
  SIGN_UP,
  SIGN_OUT,
  FORGOT_PASSWORD
} from '../action-types';

interface AuthState {
  isAuthenticated?: boolean;
  email?: string;
}

interface AuthAction extends Action {
  payload: AuthState
}

const initState: AuthState = {
  isAuthenticated: false
};

export const authReducer = handleActions({
  [AUTH_CHECKED]: (
    state: AuthState,
    { payload: { isAuthenticated } }: AuthAction
  ) => ({ ...state, isAuthenticated }),
  [SIGN_IN]: (
    state: AuthState,
    { payload: { email, isAuthenticated } }: AuthAction
  ) => ({ ...state, email, isAuthenticated }),
  [SIGN_UP]: (
    state: AuthState,
    { payload: { email } }: AuthAction
  ) => ({ ...state, email }),
  [SIGN_OUT]: (state: AuthState) => ({ ...state, isAuthenticated: false }),
  [FORGOT_PASSWORD]: (
    state: AuthState,
    { payload: { email } }: AuthAction
  ) => ({ ...state, email }),
}, initState)