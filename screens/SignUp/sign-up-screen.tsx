import React from 'react';
import { ScrollView, View, Button } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import styles from './styles';
import { Credentials, User } from '../../types/user';
import { BasicTextField } from '../../components/BasicTextField/basic-text-field.component';
import { ToastAndroid } from 'react-native';
import { signUp } from '../../store/auth/auth.actions';
import { createUser } from '../../store/users/users.actions';
import { AuthComponentProps, withEmailConfirmation } from '../../wrappers/auth/withEmailConfirmation';

type StateKeys = 'email' | 'password' | 'confirmPassword' | 'nickname' | 'username';

interface SignUpProps extends NavigationParams, AuthComponentProps {
  signUp: (user: Credentials, onUserExistsHandler?: Function) => Promise<boolean>;
  createUser: (user: User) => Promise<void>;
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
    const { email, password, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      return ToastAndroid.show('The passwords do not match', ToastAndroid.LONG);
    }

    const user = await this.props.signUp(
      { email, password },
      this.onUserExistsHandler
    );

    if(user) {
      // TODO check is user created
      // await this.props.createUser({ ...this.state });

      this.props.confirmRegistration(
        { email, password },
        'Confirmation code sent to your inbox, please check it and input code'
      );
    }
  }

  onUserExistsHandler = () => {
    ToastAndroid.show('User already exists, please try to sign in', ToastAndroid.LONG);
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
      <>
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
      </>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signUp: (user: Credentials, onUserExistsHandler?: Function) =>
    dispatch(signUp(user, onUserExistsHandler)),
  createUser: (user: User) => dispatch(createUser(user)),
});

export default compose(
  connect(null, mapDispatchToProps),
  withEmailConfirmation
)(SignUpScreen);