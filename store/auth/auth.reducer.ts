import { User } from "aws-sdk/clients/appstream";
import { Action } from "redux";

interface AuthState {
  user?: User
}

interface AuthAction extends Action {
  payload: AuthState
}

const initState: AuthState = {};

export const authReducer = (state = initState, actions: AuthAction): AuthState => {
  return state;
}