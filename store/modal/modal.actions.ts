
import { CLOSE_MODAL, OPEN_MODAL, OPEN_SUBMODAL } from '../action-types';
import { ModalAction } from './modal.reducer';

export const openModal = (element: React.ReactNode): ModalAction => ({
  type: OPEN_MODAL,
  payload: {
    modalComponent: element
  }
})

export const openChildModal = (element: React.ReactNode): ModalAction => ({
  type: OPEN_SUBMODAL,
  payload: {
    modalComponent: element
  }
})

export const closeModal = () => ({
  type: CLOSE_MODAL
})