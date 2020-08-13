import { handleActions } from 'redux-actions';
import { UPDATE_OPENED_CHAT } from '@store/action-types';
import { Action } from 'redux';

interface AppSharedState {
    openedChat: string | null;
}

interface AppSharedAction extends Action {
    payload: AppSharedState;
}

const initialState = {
    openedChat: null
}

export const appSharedReducer = handleActions({
    [UPDATE_OPENED_CHAT]: (
        state: AppSharedState,
        { payload: { openedChat } }: AppSharedAction
    ) => ({ ...state, openedChat })
}, initialState);
