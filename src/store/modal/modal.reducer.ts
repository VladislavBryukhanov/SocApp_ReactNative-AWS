import { Action } from 'redux';
import { clone } from 'lodash';
import { OPEN_MODAL, CLOSE_MODAL, OPEN_SUBMODAL } from '@store/action-types';
import { handleActions } from 'redux-actions';

export interface ModalComponent {
  modalComponent: React.ReactNode
}

export interface ModalState {
  modalDialogs: ModalComponent[];
}

export interface ModalAction extends Action {
  payload: ModalComponent
}

const initState: ModalState = {
  modalDialogs: []
}

export const modalReducer = handleActions({
  [OPEN_MODAL]: (state: ModalState, { payload }: ModalAction) => ({
      modalDialogs: [payload]
  }),
  [OPEN_SUBMODAL]: (state: ModalState, { payload }: ModalAction) => ({
    modalDialogs: [ ...state.modalDialogs, payload ]
  }),
  [CLOSE_MODAL]: (state: ModalState) => {
    const mutableModalList = clone(state);
    mutableModalList.modalDialogs.pop();
    return mutableModalList;
  }
}, initState);
