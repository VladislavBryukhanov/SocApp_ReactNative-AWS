import s3 from '@api/s3/native-s3';
import { FileBase64 } from '@models/file-base64';
import { AppState } from './../index';
import { Dispatch } from 'redux';
import UsersRepository from "@api/repositories/users.repository";
import { 
  FETCH_USERS,
  FETCH_PROFILE,
  UPDATE_PROFILE,
  UPDATE_AVATAR
} from "@store/action-types";
import errorHandler from "@store/errorHandler";
import { User } from '@models/user';
import { joinAvatar } from '@helpers/join-avatar';

export const fetchUsers = (): any => (
  async (dispatch: Dispatch, getState: () => AppState) => {
    try {
      const userList = await UsersRepository.list();
      const me = getState().usersModule.profile!;
    
      const users = await Promise.all(
        userList.filter(({ id }) => id !== me.id).map(joinAvatar)
      );

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
  async (dispatch: Dispatch) => {
    try {
      const profile = await UsersRepository
        .fetchProfile()
        .then(joinAvatar);
      
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

export const updateProfileAvatar = (avatar: FileBase64): any => (
  async (dispatch: Dispatch) => {
    try {
      const { data, type, extension } = avatar;

      const avatarUrl = await UsersRepository.uploadProfileAvatar(
        data, type, extension
      ).then(({ s3Key }) => s3.read(s3Key))

      dispatch({
        type: UPDATE_AVATAR,
        payload: { avatarUrl }
      });

      return avatarUrl;
    } catch (err) {
      errorHandler(err, 'updateProfileAvatar');
    }
  }
)