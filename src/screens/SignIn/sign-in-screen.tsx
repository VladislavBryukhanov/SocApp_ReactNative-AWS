import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { NavigationSwitchScreenProps } from 'react-navigation';
import { Dispatch, compose } from 'redux';
import { connect } from 'react-redux';
import { Credentials } from '@models/user';
import baseStyles from '@components/atoms/base.styles';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import ForgotPassword from '@components/modals/ForgotPassword/forgot-password.component';
import { withEmailConfirmation, AuthComponentProps } from '@wrappers/auth/withEmailConfirmation';
import { signIn } from '@store/auth/auth.actions';
import { openModal } from '@store/modal/modal.actions';
import styles from './styles';
import { EMAIL_NOT_CONFIRMED } from '@constants/text-auth';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Button } from 'react-native-paper';
import messaging from '@react-native-firebase/messaging';
import { updateNotificationToken } from '@store/users/users.actions';
import { AppState } from '@store/index';

interface SignInProps extends NavigationSwitchScreenProps, AuthComponentProps {
  signIn: (user: Credentials, confirmationExceptionHandler?: Function) => Promise<boolean>;
  openModal: (element: React.ReactNode) => void;
  updateNotificationToken: (token: string) => Promise<void>;
  isAuthenticated?: boolean;
}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (props.isAuthenticated) {
    props.navigation.navigate('AuthLoading');
  }

  const onSignIn = async () => {
    setLoading(true);

    await props.signIn({ email, password }, onUserIsNotConfirmedHandler);

    const token = await messaging().getToken();
    await props.updateNotificationToken(token);

    setLoading(false);
  }

  const onUserIsNotConfirmedHandler = async () => {
    await props.confirmRegistration(EMAIL_NOT_CONFIRMED);
    props.onRegestrationComplete();
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
          onChangeText={(text: string) => setEmail(text.toLowerCase())}
        />

        <BasicTextField
          label='Password'
          value={password}
          secureTextEntry={true}
          onChangeText={(text: string) => setPassword(text)}
        />
      </View>
      
      <Button
        mode="outlined"
        loading={loading}
        disabled={loading}
        style={styles.signInBtn}
        color={Colors.primary}
        onPress={onSignIn}
      >
        Sign in
      </Button>
      
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

const mapStateToProps = (store: AppState) => ({
  isAuthenticated: store.authModule.isAuthenticated
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signIn: (credentials: Credentials, confirmationExceptionHandler?: Function) => 
    dispatch(signIn(credentials, confirmationExceptionHandler)),
  openModal: (element: React.ReactNode) => dispatch(openModal(element)),
  updateNotificationToken: (token: string) => dispatch(updateNotificationToken(token)),
});

export default compose<SignInProps>(
  connect(mapStateToProps, mapDispatchToProps),
  withEmailConfirmation
)(SignInScreen);