import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal, View, ModalProps } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import styles from './styles';

interface ModalDialogProps extends ModalProps {
  displayedDialog?: React.ReactNode,
  onClose: () => void
}

const ModalDialog = (props: ModalDialogProps) => (
  <>
    {props.displayedDialog && (
      <Modal {...props}>
        <View style={styles.modal}>
          <Icon 
            name="close"
            style={styles.closeButton}
            onPress={props.onClose}
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

export default connect(
  mapStateToProps
)(ModalDialog);