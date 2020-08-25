import { Action, Reducer } from 'redux';
import { handleActions } from "redux-actions";
import { 
  FETCH_ACTIVE_CHATS,
  FIND_DIRECT_BY_INTERLOCUTOR, 
  DISPOSE_DIRECT_SEARCH_RESULT,
  GET_CHAT_DETAILS,
  CLOSE_CHAT,
  CHAT_CREATING,
  CHAT_CREATED
} from '@store/action-types';
import { ChatRoom } from "@models/chat-room";

interface ChatRoomsState {
  lastFoundDirect?: ChatRoom;
  activeChats?: ChatRoom[];
  openedChatDetails?: ChatRoom;
  chatLoading?: boolean;
}

interface ChatRoomAction extends Action {
  payload: {
    chat?: ChatRoom;
    detailedChat?: ChatRoom;
    chatList?: ChatRoom[];
  }
}

const initState: ChatRoomsState = {}

export const chatRoomsReducer: Reducer<ChatRoomsState, ChatRoomAction> = handleActions({
  [FETCH_ACTIVE_CHATS]: (state, { payload: { chatList } }: ChatRoomAction) => ({ ...state, activeChats: chatList }),
  [CHAT_CREATING]: (state) => ({ ...state, chatLoading: true }),
  [CHAT_CREATED]: (state) => ({ ...state, chatLoading: false }),
  [FIND_DIRECT_BY_INTERLOCUTOR]: (state, { payload: { chat } }: ChatRoomAction) => ({ ...state, lastFoundDirect: chat }),
  [DISPOSE_DIRECT_SEARCH_RESULT]: (state) => ({ ...state, lastFoundDirect: undefined }),
  [GET_CHAT_DETAILS]: (state, { payload: { detailedChat } }: ChatRoomAction) => ({ ...state, openedChatDetails: detailedChat }),
  [CLOSE_CHAT]: (state) => ({ ...state, openedChatDetails: undefined }),
}, initState);

