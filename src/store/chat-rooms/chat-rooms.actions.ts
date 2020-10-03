import { Dispatch } from 'redux';
import ChatRoomsRepository from '@api/repositories/chat-rooms.repository';
import errorHandler from '@store/errorHandler';
import { 
  FETCH_ACTIVE_CHATS,
  FIND_DIRECT_BY_INTERLOCUTOR, 
  DISPOSE_DIRECT_SEARCH_RESULT,
  GET_CHAT_DETAILS,
  CLOSE_CHAT,
  CHAT_CREATING,
  CHAT_CREATED,
  UPDATE_LAST_MESSAGE,
} from '@store/action-types';
import { CreateChatRoom } from '@models/chat-room';
import { Message } from '@models/message';
import { joinAvatar } from '@helpers/join-avatar';

export const fetchActiveChats = (): any => (
  async (dispatch: Dispatch) => {
    try {
      const chatList = await ChatRoomsRepository.list();
      const chatRooms = await Promise.all(
        chatList.map(joinAvatar)
      );

      dispatch({
        type: FETCH_ACTIVE_CHATS,
        payload: { chatList: chatRooms }
      });
    } catch (err) {
      errorHandler(err, 'fetchActiveChats');
    }
  }
);

export const createChat = (chatPayload: CreateChatRoom): any => 
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: CHAT_CREATING });

      const chat = await ChatRoomsRepository.create(chatPayload);

      dispatch({ type: CHAT_CREATED });
      dispatch(getChatDetails(chat.id));
    } catch (err) {
      errorHandler(err, 'createChat');
    }
  }

export const findDirectByInterlocutor = (interlocutorId: string): any =>
  async (dispatch: Dispatch) => {
    dispatch({ type: DISPOSE_DIRECT_SEARCH_RESULT });

    try {
      const chat = await ChatRoomsRepository.findByInterlocutorId(interlocutorId);
      dispatch({
        type: FIND_DIRECT_BY_INTERLOCUTOR,
        payload: { chat }
      });
    } catch (err) {
      errorHandler(err, 'findDirectByInterlocutor');
    }
  }

export const getChatDetails = (chatId: string): any => 
  async (dispatch: Dispatch) => {
    try {
      const detailedChat = await ChatRoomsRepository.getDetails(chatId);
      dispatch({
        type: GET_CHAT_DETAILS,
        payload: { detailedChat },
      });
    } catch (err) {
      errorHandler(err, 'getCahtDetails');
    }
  }

export const updateChatLastMessage = (lastMessage: Message) => ({
  type: UPDATE_LAST_MESSAGE,
  payload: { lastMessage },
});

export const disposeChat = () => ({ type: CLOSE_CHAT, payload: {} });