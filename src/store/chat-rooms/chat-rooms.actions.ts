import { Dispatch } from 'redux';
import ChatRoomsRepository from '@api/repositories/chat-rooms.repository';
import errorHandler from '@store/errorHandler';
import { FETCH_ACTIVE_CHATS } from '@store/action-types';

export const fetchActiveChats = (): any => (
  async (dispatch: Dispatch) => {
    try {
      const activeChats = await ChatRoomsRepository.list();

      dispatch({
        type: FETCH_ACTIVE_CHATS,
        payload: { activeChats }
      });
    } catch (err) {
      errorHandler(err, 'fetchActiveChats');
    }
  }
);
