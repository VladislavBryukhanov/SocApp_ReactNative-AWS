import { Dispatch } from "redux";
import { User } from '../../types/user';
import { UsersRepository } from "../api/users.repository";

export const fetchUsers = (): any => (
  async (dispatch: Dispatch) => {
    console.log('fetch')
  }
)

export const createUser = (user: User): any => (
  async (dispatch: Dispatch) => {
    const response = await UsersRepository.create(user);
    console.log(response);
  }
)