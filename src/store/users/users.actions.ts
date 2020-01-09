import { Dispatch } from 'redux';
import UsersRepository from "@api/repositories/users.repository";
import { FETCH_USERS, FETCH_PROFILE } from "@store/action-types";
import { AppState } from '@store/index';
import errorHandler from "@store/errorHandler";

export const fetchUsers = (): any => (
  async (dispatch: Dispatch) => {
    try {
      const users = await UsersRepository.list();
      dispatch({
        type: FETCH_USERS,
        payload: { 
          fetchedUsers: users
        }
      });
    } catch (err) {
      errorHandler(err, 'fetchUsers');
    }
  }
);

export const fetchProfile = (): any => (
  async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const profile = await UsersRepository.fetchProfile(
        getState().authModule.cognitoUsername!
      );
      
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