import React from 'react';
import { ScrollView, View, Button, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styles from './styles';
import { createUser } from '../../store/users/users.actions';
import { Credentials } from '../../types/user';
import { BasicTextField } from '../../components/basic-text-field/basic-text-field.component';
import { ToastAndroid } from 'react-native';
import { signUp } from '../../store/auth/auth.actions';
import { ModalComponent } from '../../store/modal/modal.reducer';
import { openModal } from '../../store/modal/modal.actions';
import { closeModal } from '../../store/modal/modal.actions';
import SignUpConfirmation from '../../components/sign-up-confirmation-code/sign-up-confirmation-code.component';

interface SignUpProps extends NavigationParams {
  createUser: (user: Credentials) => Promise<void>;
  signUp: (user: Credentials, onUserExistsHandler?: Function) => Promise<boolean>;
}

interface SignUpState {
  email: string,
  password: string;
  confirmPassword: string;
}

class SignUpScreen extends React.Component<SignUpProps, SignUpState> {
  state = {
    email: 'messagebotforsite@gmail.com',
    password: 'P@ssw0rd',
    confirmPassword: 'P@ssw0rd',
  }

  onSignUp = async () => {
    const { email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      return ToastAndroid.show('The passwords do not match', ToastAndroid.LONG);
    }

    const user = await this.props.signUp(
      { email, password },
      this.onUserExistsHandler
    );

    if(user) {
      this.confirmRegistration();
    }
  }

  onUserExistsHandler = () => {
    ToastAndroid.show('User already exists, please try to sign in', ToastAndroid.LONG);
    this.props.navigation.navigate('SignIn');
  }

  confirmRegistration = () => {
    const { email, password } = this.state;
    const confirmRegistrationDialog = (
      <SignUpConfirmation
        credentials={{ email, password }}
        onComplete={this.onRegestrationComplete}
      />
    )

    Alert.alert(
      'Complete registration',
      'Confirmation code sent to your inbox, please check it and input code',
      [{
        text: 'Ok',
        onPress: () => this.props.openModal(confirmRegistrationDialog)
      }],
      {cancelable: false}
    )
  }

  onRegestrationComplete = async () => {
    const { email, password } = this.state;
    
    await this.props.createUser({ email, password });
    this.props.closeModal();
    this.props.navigation.navigate('UserList');
  }

  render() {
    const { email, password, confirmPassword } = this.state;

    return (
      <>
        <ScrollView
          keyboardShouldPersistTaps='handled'
          style={styles.scrollView}
        >
          <View style={styles.authForm}>
            <BasicTextField
              label='Email'
              value={email}
              onChangeText={(text: string) => this.setState({ email: text })}
            />
  
            <BasicTextField
              label='Password'
              value={password}
              secureTextEntry={true}
              onChangeText={(text: string) => this.setState({ password: text })}
            />
          
            <BasicTextField
              label='Confirm password'
              value={confirmPassword}
              secureTextEntry={true}
              onChangeText={(text: string) => this.setState({ confirmPassword: text })}
            />
          </View>
  
          <Button title="Sign up" onPress={this.onSignUp}/>
        </ScrollView>
      </>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createUser: (user: Credentials) => dispatch(createUser(user)),
  signUp: (user: Credentials, onUserExistsHandler?: Function) => dispatch(signUp(user, onUserExistsHandler)),
  openModal: (element: ModalComponent) => dispatch(openModal(element)),
  closeModal: () => dispatch(closeModal())
});

export default connect(
  null,
  mapDispatchToProps
)(SignUpScreen);