import { Dispatch } from "redux";
import { Credentials } from '../../types/user';
import { UsersRepository } from "../../api/users.repository";
import { CREATE_USER } from "../../store/action-types";
import { FETCH_USERS } from '../action-types';
import errorHandler from "../../store/errorHandler";

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
      errorHandler(err);
    }
  }
)

export const createUser = (user: Credentials): any => (
  async (dispatch: Dispatch) => {
    try {
      const newUser = await UsersRepository.create(user);
      dispatch({
        type: CREATE_USER,
        payload: { newUser }
      });
    } catch (err) {
      errorHandler(err);
    }
  }
)