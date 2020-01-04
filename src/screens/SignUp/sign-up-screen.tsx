import React from 'react';
import { ToastAndroid, ScrollView, View, Button } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { Dispatch, compose } from 'redux';
import { connect } from 'react-redux';
import { Credentials, UserAttributes } from '@models/user';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { signUp, signIn } from '@store/auth/auth.actions';
import { createUser } from '@store/users/users.actions';
import { AuthComponentProps, withEmailConfirmation } from '@wrappers/auth/withEmailConfirmation';
import { CONFIRM_REGISTRATION, USER_EXISTS, PASSWORDS_DO_NOT_MATCH } from '@constants/text-auth';
import styles from './styles';

type StateKeys = 'email' | 'password' | 'confirmPassword' | 'nickname' | 'username';

interface SignUpProps extends NavigationParams, AuthComponentProps {
  signUp: (
    user: Credentials,
    userAttributes: UserAttributes,
    onUserExistsHandler?: Function
  ) => Promise<boolean>;
  signIn: (
    user: Credentials,
    confirmationExceptionHandler?: Function
  ) => Promise<boolean>;
}

interface SignUpState {
  email: string,
  password: string;
  confirmPassword: string;
  nickname: string;
  username: string;
  [key: string]: string;
}

class SignUpScreen extends React.Component<SignUpProps, SignUpState> {
  state = {
    email: '',
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
  }

  onSignUp = async () => {
    const { email, password, username, nickname, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      return ToastAndroid.show(PASSWORDS_DO_NOT_MATCH, ToastAndroid.LONG);
    }

    const user = await this.props.signUp(
      { email, password },
      { username, nickname },
      this.onUserExistsHandler
    );

    if(user) {
      await this.props.confirmRegistration(CONFIRM_REGISTRATION);
      await this.props.signIn({ email, password });
      this.props.onRegestrationComplete();
    }
  }

  onUserExistsHandler = () => {
    ToastAndroid.show(USER_EXISTS, ToastAndroid.LONG);
    this.props.navigation.navigate('SignIn');
  }

  commonProps = (fieldName: StateKeys) => ({
    value: this.state[fieldName],
    onChangeText: (text: string) => this.setState({
      [fieldName]: text
    })
  });

  render() {

    return (
      <ScrollView
        keyboardShouldPersistTaps='handled'
        style={styles.scrollView}
      >
        
        <View style={styles.authForm}>
          <BasicTextField
            label='Email*'
            {...this.commonProps('email')}
          />

          <BasicTextField
            label='Password*'
            secureTextEntry={true}
            {...this.commonProps('password')}
          />
        
          <BasicTextField
            label='Confirm password*'
            secureTextEntry={true}
            {...this.commonProps('confirmPassword')}
          />

          <BasicTextField
            label='Username*'
            description='Unique name of your user'
            {...this.commonProps('username')}
          />

          <BasicTextField
            label='Nickname'
            description='Nickname which will be displayed for your user'
            {...this.commonProps('nickname')}
          />
        </View>

        <View style={styles.signUpBtn}>
          <Button title="Sign up" onPress={this.onSignUp}/>
        </View>

      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signUp: (
    user: Credentials,
    userAttributes: UserAttributes,
    onUserExistsHandler?: Function
  ) => dispatch(signUp(user, userAttributes, onUserExistsHandler)),
  signIn: (credentials: Credentials, confirmationExceptionHandler?: Function) => 
    dispatch(signIn(credentials, confirmationExceptionHandler)),
});

export default compose<SignUpProps>(
  connect(null, mapDispatchToProps),
  withEmailConfirmation
)(SignUpScreen);