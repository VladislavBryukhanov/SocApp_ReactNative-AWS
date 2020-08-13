import { UPDATE_OPENED_CHAT } from '@store/action-types';

export const updateOpenedChat = (openedChat: string | null)=> ({
    type: UPDATE_OPENED_CHAT,
    payload: { openedChat }
});
