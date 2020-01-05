import { Dispatch } from "redux";
import UsersRepository from "@api/repositories/users.repository";
import { FETCH_USERS } from "@store/action-types";
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
)