import { Action } from "redux";
import { AUTH_CHECKED, SIGN_IN, SIGN_UP, SIGN_OUT } from './../action-types';

interface AuthState {
  isAuthenticated?: boolean;
}

interface AuthAction extends Action {
  payload: AuthState
}

const initState: AuthState = {
  isAuthenticated: false
};

export const authReducer = (state = initState, action: AuthAction): AuthState => {
  switch(action.type) {
    case AUTH_CHECKED:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated
      }
    case SIGN_IN: 
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated
      }
    case SIGN_UP: 
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated
      }
    case SIGN_OUT: {
      return {
        ...state,
        isAuthenticated: false
      }
    }
  }
  return state;
}