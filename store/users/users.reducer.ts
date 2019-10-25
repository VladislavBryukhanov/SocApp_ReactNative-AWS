import { Action } from 'redux';
import { User } from '../../types/user';
import { FETCH_USERS, CREATE_USER } from '../action-types';

interface IUserState {
  users: User[]
}

interface IUserAction extends Action {
  payload: {
    fetchedUsers?: User[],
    newUser?: User,
    // updateUser?: User,
    // deletedUser?: User
  }
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
          ...action.payload.fetchedUsers!
        ]
      };
    case CREATE_USER:
      return {
        users: [
          ...state.users,
          action.payload.newUser!
        ]
      }

    default: 
      return state;
  }
}