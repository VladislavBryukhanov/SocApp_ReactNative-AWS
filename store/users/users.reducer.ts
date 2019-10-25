import { User } from 'types/user';
import { Action } from 'redux';
import { FETCH_USERS, CREATE_USER } from '../action-types';

interface IUserState {
  users: User[]
}

interface IUserAction extends Action {
  payload: IUserState
}

const initState: IUserState = {
  users: []
};

export const usersReducer = (state = initState, action: IUserAction): IUserState => {
  switch(action.type) {
    case FETCH_USERS:
      return {
        users: [
          ...state.users,
          ...action.payload.users
        ]
      };
    case CREATE_USER:
      return {
        users: [
          ...state.users,
          ...action.payload.users
        ]
      }

    default: 
      return state;
  }
}