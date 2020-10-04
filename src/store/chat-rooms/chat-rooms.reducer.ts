import { Action, Reducer } from 'redux';
import { handleActions } from "redux-actions";
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
import { ChatRoom } from "@models/chat-room";
import { Message } from '@models/message';

interface ChatRoomsState {
  lastFoundDirect?: ChatRoom;
  activeChats?: ChatRoom[];
  openedChatDetails?: ChatRoom;
  chatCreating?: boolean;
}

interface ChatRoomAction extends Action {
  payload: {
    chat?: ChatRoom;
    detailedChat?: ChatRoom;
    chatList?: ChatRoom[];
    lastMessage?: Message;
  }
}

const initState: ChatRoomsState = {}

export const chatRoomsReducer: Reducer<ChatRoomsState, ChatRoomAction> = handleActions({
  [UPDATE_LAST_MESSAGE]: (state, { payload: { lastMessage } }: ChatRoomAction) => {
    const updatedActiveChats = state.activeChats?.map(chat => {
      if (chat.id === lastMessage?.chatId) {
        return { ...chat, lastMessage };
      }
      return chat;
    });

    return { ...state,
      activeChats: updatedActiveChats
    };
  },
  [FETCH_ACTIVE_CHATS]: (state, { payload: { chatList } }: ChatRoomAction) => ({ ...state, activeChats: chatList }),
  [CHAT_CREATING]: (state) => ({ ...state, chatCreating: true }),
  [CHAT_CREATED]: (state, { payload: { chat } }: ChatRoomAction) => {
    const activeChats = state.activeChats || [];
    
    if (chat) {
      activeChats.push(chat);
    }

    return { ...state,
      chatCreating: false,
      activeChats
    };
  },
  [FIND_DIRECT_BY_INTERLOCUTOR]: (state, { payload: { chat } }: ChatRoomAction) => ({ ...state, lastFoundDirect: chat }),
  [DISPOSE_DIRECT_SEARCH_RESULT]: (state) => ({ ...state, lastFoundDirect: undefined }),
  [GET_CHAT_DETAILS]: (state, { payload: { detailedChat } }: ChatRoomAction) => ({ ...state, openedChatDetails: detailedChat }),
  [CLOSE_CHAT]: (state) => ({ ...state, openedChatDetails: undefined }),
}, initState);

