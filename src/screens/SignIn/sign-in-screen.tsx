import React, { useState } from 'react';
import { ScrollView, View, Button, Text } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { Dispatch, compose } from 'redux';
import { connect } from 'react-redux';
import { Credentials } from '@types/user';
import baseStyles from '@components/base.styles';
import { BasicTextField } from '@components/BasicTextField/basic-text-field.component';
import ForgotPassword from '@components/modals/ForgotPassword/forgot-password.component';
import { withEmailConfirmation, AuthComponentProps } from '@wrappers/auth/withEmailConfirmation';
import { signIn } from '@store/auth/auth.actions';
import { openModal } from '@store/modal/modal.actions';
import styles from './styles';

interface SignInProps extends NavigationParams, AuthComponentProps {
  signIn: (user: Credentials, confirmationExceptionHandler?: Function) => Promise<boolean>;
  openModal: (element: React.ReactNode) => void;
}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = async () => {
    const user = await props.signIn({ email, password }, onUserIsNotConfirmedHandler);
    if (user) {
      props.navigation.navigate('App');
    }
  }

  const onUserIsNotConfirmedHandler = () => {
    props.confirmRegistration(
      { email, password },
      'You still doesn\'t confirm your email, please check your inbox and input code'
    );
  }

  const goToSignUp = () => {
    props.navigation.navigate('SignUp');
  }

  const onForgotPassword = () => {
    props.openModal(React.createElement(ForgotPassword));
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      style={styles.scrollView}
    >

      <View style={styles.authForm}>
        <BasicTextField
          label='Email'
          value={email}
          onChangeText={(text: string) => setEmail(text)}
        />

        <BasicTextField
          label='Password'
          value={password}
          secureTextEntry={true}
          onChangeText={(text: string) => setPassword(text)}
        />
      </View>
      
      <Button title="Sign in" onPress={onSignIn}/>
      
      <Text onPress={onForgotPassword} style={baseStyles.linkButton}>
        Forgot password
      </Text>

      <View style={styles.signUpWrapper}>
        <Text style={styles.description}>Don't have an account?</Text>
        <Text onPress={goToSignUp} style={baseStyles.linkButton}>
          Sign up
        </Text>
      </View>
      
    </ScrollView>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signIn: (credentials: Credentials, confirmationExceptionHandler?: Function) => 
    dispatch(signIn(credentials, confirmationExceptionHandler)),
  openModal: (element: React.ReactNode) => dispatch(openModal(element)),
});

export default compose(
  connect(null, mapDispatchToProps),
  withEmailConfirmation
)(SignInScreen);