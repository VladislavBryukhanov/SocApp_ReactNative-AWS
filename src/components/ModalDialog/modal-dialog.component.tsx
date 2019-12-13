import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal, View, ModalProps } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '@store/index';
import { closeModal } from '@store/modal/modal.actions';
import styles from './styles';
import { Dispatch } from 'redux';

interface ModalDialogProps extends ModalProps {
  displayedDialog?: React.ReactNode;
  closeModal: () => void;
}

const ModalDialog = (props: ModalDialogProps) => (
  <>
    { props.displayedDialog && (
      <Modal {...props}>
        <View style={styles.modal}>
          <Icon 
            name="close"
            style={styles.closeButton}
            onPress={props.closeModal}
          />
          {props.displayedDialog}
        </View>
      </Modal>
    )}
  </>
)

const mapStateToProps = (store: AppState) => {
  const { modalDialogs } = store.modalModule;
  const lastDialog = modalDialogs[modalDialogs.length - 1];
  
  return {
    displayedDialog: lastDialog && lastDialog.modalComponent
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModalDialog);