import { Dispatch } from "redux";
import { User } from '../../types/user';
import { UsersRepository } from "../api/users.repository";
import { CREATE_USER } from "../../store/action-types";
import { FETCH_USERS } from '../action-types';

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
      console.log('ERROR HANDLING...')
      console.log(err)
    }
  }
)

export const createUser = (user: User): any => (
  async (dispatch: Dispatch) => {
    try {
      const newUser = await UsersRepository.create(user);
      dispatch({
        type: CREATE_USER,
        payload: { newUser }
      });
    } catch (err) {
        console.log('ERROR HANDLING...')
        console.log(err)
    }
  }
)