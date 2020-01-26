import { UPDATE_PROFILE } from './../action-types';
import { AppState } from './../index';
import { Dispatch } from 'redux';
import UsersRepository from "@api/repositories/users.repository";
import { FETCH_USERS, FETCH_PROFILE } from "@store/action-types";
import errorHandler from "@store/errorHandler";
import { User } from '@models/user';

export const fetchUsers = (): any => (
  async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const users = await UsersRepository.list();
      const me = getState().usersModule.profile!;

      dispatch({
        type: FETCH_USERS,
        payload: { 
          fetchedUsers: users.filter(({ id }) => id !== me.id)
        }
      });
    } catch (err) {
      errorHandler(err, 'fetchUsers');
    }
  }
);

export const fetchProfile = (): any => (
  async (dispatch: Dispatch) => {
    try {
      const profile = await UsersRepository.fetchProfile();
      
      dispatch({
        type: FETCH_PROFILE,
        payload: { profile }
      });

      return profile;
    } catch (err) {
      errorHandler(err, 'fetchProfile');
    }
  }
);

export const editProfile = (changes: Partial<User>): any => (
  async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      await UsersRepository.editProfile(changes);
      const me = getState().usersModule.profile!;
      const profile = { ...me, ...changes };

      dispatch({
        type: UPDATE_PROFILE,
        payload: { profile }
      });

      return profile;
    } catch (err) {
      errorHandler(err, 'editProfile');
    }
  }
);