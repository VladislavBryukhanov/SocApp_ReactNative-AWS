import { UPDATE_PROFILE } from '@store/action-types';
import { Action, Reducer } from 'redux';
import { User } from '@models/user';
import { FETCH_USERS, CREATE_USER, FETCH_PROFILE } from '@store/action-types';
import { handleActions } from 'redux-actions';

interface UserState {
  users: User[],
  profile?: User
}

interface UserAction extends Action {
  payload: {
    fetchedUsers?: User[],
    newUser?: User,
    profile? : User
  }
}

const initState: UserState = {
  users: []
};

const profileHandler = (
  state: UserState,
  { payload: { profile } }: UserAction
) => ({ ...state, profile });

export const usersReducer: Reducer<UserState, UserAction> = handleActions({
  [FETCH_PROFILE]: profileHandler,
  [UPDATE_PROFILE]: profileHandler,
  [FETCH_USERS]: (
    state: UserState,
    { payload: { fetchedUsers } }: UserAction
  ) => ({ ...state, users: [ ...state.users, ...fetchedUsers! ] }),
  [CREATE_USER]: (
    state: UserState,
    { payload: { newUser } }: UserAction
  ) => ({ ...state, users: [ ...state.users, newUser! ]})
}, initState);