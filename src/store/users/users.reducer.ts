import { Action, Reducer } from 'redux';
import { User } from '@models/user';
import { FETCH_USERS, CREATE_USER } from '@store/action-types';
import { handleActions } from 'redux-actions';

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

export const usersReducer: Reducer<UserState, UserAction> = handleActions({
  [FETCH_USERS]: (
    state: UserState,
    { payload: { fetchedUsers } }: UserAction
  ) => ({ users: [ ...state.users, ...fetchedUsers! ] }),
  [CREATE_USER]: (
    state: UserState,
    { payload: { newUser } }: UserAction
  ) => ({ users: [ ...state.users, newUser! ]})
}, initState);