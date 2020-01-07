import React from 'react';
import { Alert } from 'react-native';
import { NavigationSwitchScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import SignUpConfirmation from '@components/modals/SignUpConfirmationCode/sign-up-confirmation-code.component';
import { openModal, closeModal } from '@store/modal/modal.actions';

export interface AuthComponentProps extends NavigationSwitchScreenProps {
  openModal: (element: React.ReactNode) => void;
  closeModal: () => void;

  // child
  confirmRegistration: (description: string) => Promise<undefined>;
  onRegestrationComplete: () => void;
}

export const withEmailConfirmation = <P extends object>(Component: React.ComponentType<P>) => {
  class WrappedComponent extends React.Component<P & AuthComponentProps> {

    confirmRegistration = (description: string): Promise<undefined> => 
      new Promise((resolve, reject) => {
        const confirmRegistrationDialog = (
          <SignUpConfirmation onComplete={resolve}/>
        );

        Alert.alert(
          'Complete registration',
          description,
          [{
            text: 'Ok',
            onPress: () => this.props.openModal(confirmRegistrationDialog)
          }],
          { cancelable: false }
        )
      })

    onRegestrationComplete = () => {
      this.props.closeModal();
      this.props.navigation.navigate('App');
    }
    
    render() {
      return <Component
        {...this.props as P}
        confirmRegistration={this.confirmRegistration}
        onRegestrationComplete={this.onRegestrationComplete}
      />
    }
  }

  return connect(null, mapDispatchToProps)(WrappedComponent);
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  openModal: (element: React.ReactNode) => dispatch(openModal(element)),
  closeModal: () => dispatch(closeModal())
});