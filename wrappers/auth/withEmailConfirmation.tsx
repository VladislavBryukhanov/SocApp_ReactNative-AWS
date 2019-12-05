import React from 'react';
import SignUpConfirmation from '../../components/modals/SignUpConfirmationCode/sign-up-confirmation-code.component';
import { Alert } from 'react-native';
import { Credentials } from '../../types/user';
import { Dispatch } from 'redux';
import { openModal, closeModal } from '../../store/modal/modal.actions';
import { connect } from 'react-redux';
import { NavigationParams } from 'react-navigation';

export interface AuthComponentProps extends NavigationParams {
  openModal: (element: React.ReactNode) => void;
  closeModal: () => void;

  // child
  confirmRegistration: (credentials: Credentials, description: string) => void;
}

export const withEmailConfirmation = <P extends object>(Component: React.ComponentType<P>) => {
  
  class WrappedComponent extends React.Component<P & AuthComponentProps> {
    confirmRegistration = (credentials: Credentials, description: string) => {
      const confirmRegistrationDialog = (
        <SignUpConfirmation
          credentials={credentials}
          onComplete={this.onRegestrationComplete}
        />
      );

      Alert.alert(
        'Complete registration',
        description,
        [{
          text: 'Ok',
          onPress: () => this.props.openModal(confirmRegistrationDialog)
        }],
        {cancelable: false}
      )
    }

    onRegestrationComplete = () => {
      this.props.closeModal();
      this.props.navigation.navigate('App');
    }
    
    render() {
      return <Component {...this.props as P} confirmRegistration={this.confirmRegistration}/>
    }
  }

  return connect(null, mapDispatchToProps)(WrappedComponent);
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openModal: (element: React.ReactNode) => dispatch(openModal(element)),
  closeModal: () => dispatch(closeModal())
});