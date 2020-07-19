import React from 'react';
import { Button } from 'react-native-paper';
import { ToastAndroid, ScrollView, View } from 'react-native';
import { NavigationSwitchScreenProps } from 'react-navigation';
import { Dispatch, compose } from 'redux';
import { connect } from 'react-redux';
import { Credentials, UserAttributes } from '@models/user';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { signUp, signIn } from '@store/auth/auth.actions';
import { AuthComponentProps, withEmailConfirmation } from '@wrappers/auth/withEmailConfirmation';
import { CONFIRM_REGISTRATION, USER_EXISTS, PASSWORDS_DO_NOT_MATCH } from '@constants/text-auth';
import startCase from 'lodash/startCase';
import styles from './styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';

type StateKeys = 'email' | 'password' | 'confirmPassword' | 'nickname' | 'username';

interface SignUpProps extends NavigationSwitchScreenProps, AuthComponentProps {
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
  loading: boolean;
  email: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  username: string;
  [key: string]: string | boolean;
}

class SignUpScreen extends React.Component<SignUpProps, SignUpState> {
  state = {
    email: '',
    username: '',
    nickname: '',
    password: '',
    confirmPassword: '',
    loading: false,
  }

  onSignUp = async () => {
    this.setState({ loading: true });

    const { email, password, username, nickname, confirmPassword } = this.state;

    if (password !== confirmPassword) {
      return ToastAndroid.show(PASSWORDS_DO_NOT_MATCH, ToastAndroid.LONG);
    }

    const credentials = { email: email.toLowerCase(), password };
    const userAttributes = { username, nickname };

    const user = await this.props.signUp(
      credentials,
      userAttributes,
      this.onUserExistsHandler
    );

    if(user) {
      await this.props.confirmRegistration(CONFIRM_REGISTRATION);
      await this.props.signIn({ email, password });
      this.props.onRegestrationComplete();
    }

    this.setState({ loading: false });
  }

  onUserExistsHandler = () => {
    ToastAndroid.show(USER_EXISTS, ToastAndroid.LONG);
    this.props.navigation.navigate('SignIn');
  }

  commonProps = (fieldName: StateKeys, required?: boolean) => ({
    label: startCase(fieldName) + (required ? '*' : ''),
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
          <BasicTextField {...this.commonProps('email', true)}/>

          <BasicTextField
            secureTextEntry={true}
            {...this.commonProps('password', true)}
          />
        
          <BasicTextField
            secureTextEntry={true}
            {...this.commonProps('confirmPassword')}
          />

          <BasicTextField
            description='Unique name of your account, which will provide an opportunity for other users to find you'
            {...this.commonProps('username')}
          />

          <BasicTextField
            description='Nickname which will be displayed for your user'
            {...this.commonProps('nickname')}
          />
        </View>

        <Button
          mode="outlined"
          loading={this.state.loading}
          disabled={this.state.loading}
          style={styles.signUpBtn}
          color={Colors.primary}
          onPress={this.onSignUp}
        >
          Sign up
        </Button>
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