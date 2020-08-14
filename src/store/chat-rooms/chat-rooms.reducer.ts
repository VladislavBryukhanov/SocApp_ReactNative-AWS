import { Action, Reducer } from 'redux';
import { handleActions } from "redux-actions";
import { FETCH_ACTIVE_CHATS } from "@store/action-types";
import { ChatRoom } from "@models/chat-room";

interface ChatRoomsState {
  openedChat?: ChatRoom;
  activeChats?: ChatRoom[];
}

interface ChatRoomAction extends Action {
  payload: {
    openedChat: ChatRoom;
    activeChats: ChatRoom[];
  };
}

const initState: ChatRoomsState = {}

export const chatRoomsReducer: Reducer<ChatRoomsState, ChatRoomAction> = handleActions({
  [FETCH_ACTIVE_CHATS]: (state, { payload: { activeChats } }: ChatRoomAction) => ({ ...state, activeChats })
}, initState)
