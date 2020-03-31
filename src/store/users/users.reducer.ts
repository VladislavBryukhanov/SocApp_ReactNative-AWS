import { Action, Reducer } from 'redux';
import { User, SNSCredentials } from '@models/user';
import { 
  FETCH_USERS, 
  CREATE_USER, 
  FETCH_PROFILE,
  UPDATE_PROFILE,
  UPDATE_AVATAR,
  UPDATE_NOTIFICATION_TOKEN,
} from '@store/action-types';
import { handleActions } from 'redux-actions';

interface UserState {
  users: User[],
  profile?: User
}

interface UserAction extends Action {
  payload: {
    fetchedUsers?: User[];
    newUser?: User;
    profile? : User;
    avatarUrl?: string;
    snsCreds?: SNSCredentials;
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
  [UPDATE_NOTIFICATION_TOKEN]: (
    state: UserState,
    { payload: { snsCreds } }: UserAction,
  ) => ({ ...state, profile: { ...state.profile!, snsCreds }}),
  [UPDATE_AVATAR]: (
    state: UserState,
    { payload: { avatarUrl } }: UserAction
  ) => ({ ...state, profile: { ...state.profile!, avatar: avatarUrl }}),
  [FETCH_USERS]: (
    state: UserState,
    { payload: { fetchedUsers } }: UserAction
  ) => ({ ...state, users: [ ...state.users, ...fetchedUsers! ] }),
  [CREATE_USER]: (
    state: UserState,
    { payload: { newUser } }: UserAction
  ) => ({ ...state, users: [ ...state.users, newUser! ]})
}, initState);