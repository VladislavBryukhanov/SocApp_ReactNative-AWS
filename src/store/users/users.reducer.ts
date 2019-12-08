import { Action } from 'redux';
import { User } from '@types/user';
import { FETCH_USERS, CREATE_USER } from '@store/action-types';

interface UserState {
  users: User[]
}

interface UserAction extends Action {
  payload: {
    fetchedUsers?: User[],
    newUser?: User,
    // updateUser?: User,
    // deletedUser?: User
  }
}

const initState: UserState = {
  users: []
};

export const usersReducer = (state = initState, action: UserAction): UserState => {
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