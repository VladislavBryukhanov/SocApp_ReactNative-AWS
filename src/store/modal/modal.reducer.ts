import { Action } from 'redux';
import { clone } from 'lodash';
import { OPEN_MODAL, CLOSE_MODAL, OPEN_SUBMODAL } from '@store/action-types';

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

export const modalReducer = (state = initState, actions: ModalAction): ModalState => {
  switch(actions.type) {
    case OPEN_MODAL: 
      return {
        modalDialogs: [actions.payload]
      }
    case OPEN_SUBMODAL:
      return {
        modalDialogs: [
          ...state.modalDialogs,
          actions.payload
        ]
      };
    case CLOSE_MODAL:
      const mutableModalList = clone(state);
      mutableModalList.modalDialogs.pop();
      return mutableModalList;
    default:
      return state;
  }
}