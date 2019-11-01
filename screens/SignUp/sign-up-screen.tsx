import React from 'react';
import { ScrollView, View, Button, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styles from './styles';
import { createUser } from '../../store/users/users.actions';
import { Credentials } from '../../types/user';
import { BasicTextField } from '../../components/basic-text-field/basic-text-field.component';
import SignUpConfirmation from '../../components/sign-up-confirmation-code/sign-up-confirmation-code.component';
import { ModalDialog } from '../../components/modal-dialog/modal-dialog.component';
import { ToastAndroid } from 'react-native';
import { signUp } from '../../store/auth/auth.actions';

interface SignUpProps extends NavigationParams {
  createUser: (user: Credentials) => Promise<void>;
  signUp: (user: Credentials) => Promise<boolean>;
}

interface SignUpState {
  email: string,
  password: string;
  confirmPassword: string;
  isConfirmation: boolean;
}

class SignUpScreen extends React.Component<SignUpProps, SignUpState> {
  state = {
    email: 'messagebotforsite@gmail.com',
    password: 'P@ssw0rd',
    confirmPassword: 'P@ssw0rd',
    isConfirmation: false
  }

  onSignUp = async () => {
    const { email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      return ToastAndroid.show('The passwords do not match', ToastAndroid.LONG);
    }

    const user = await this.props.signUp({ email, password });
    if(user) {
      this.confirmRegistration();
    }
  }

  confirmRegistration = () => {
    Alert.alert(
      'Complete registration',
      'Confirmation code sent to your inbox, please check it and input code',
      [{
        text: 'Ok',
        onPress: () => this.setState({ isConfirmation: true })
      }],
      {cancelable: false}
    )
  }

  onRegestrationComplete = async () => {
    const { email, password } = this.state;
    
    await this.props.createUser({ email, password });
    this.setState({ isConfirmation: false });
    this.props.navigation.navigate('UserList');
  }

  onCloseModal = () => this.setState({ isConfirmation: false })

  render() {
    const { isConfirmation, email, password, confirmPassword } = this.state;

    return (
      <>
        { isConfirmation && (
          <ModalDialog
            visible={isConfirmation}
            animationType={"slide"}
            onClose={this.onCloseModal}
          >
            <SignUpConfirmation 
              credentials={{ email, password }}
              onComplete={this.onRegestrationComplete}
            />
          </ModalDialog>
        )}
  
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
  signUp: (user: Credentials) => dispatch(signUp(user))
});

export default connect(
  null,
  mapDispatchToProps
)(SignUpScreen);