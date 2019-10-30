import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Modal, View, ModalProps } from 'react-native';
import styles from './styles';

interface ModalDialogProps extends ModalProps {
  children?: React.ReactNode,
  onClose: () => void
}

export const ModalDialog = (props: ModalDialogProps) => (
  <Modal {...props}>
    <View style={styles.modal}>
      <Icon 
        name="close"
        style={styles.closeButton}
        onPress={props.onClose}
      />
      
      {props.children}
    </View>
  </Modal>
)