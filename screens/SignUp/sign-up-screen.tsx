import React from 'react';
import { ScrollView, View, Button } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import styles from './styles';
import { Credentials } from '../../types/user';
import { BasicTextField } from '../../components/basic-text-field/basic-text-field.component';
import { ToastAndroid } from 'react-native';
import { signUp } from '../../store/auth/auth.actions';
import { AuthComponentProps, withEmailConfirmation } from '../../wrappers/withEmailConfirmation';

interface SignUpProps extends NavigationParams, AuthComponentProps {
  signUp: (user: Credentials, onUserExistsHandler?: Function) => Promise<boolean>;
}

interface SignUpState {
  email: string,
  password: string;
  confirmPassword: string;
}

class SignUpScreen extends React.Component<SignUpProps, SignUpState> {
  state = {
    email: '',
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
  signUp: (user: Credentials, onUserExistsHandler?: Function) => dispatch(signUp(user, onUserExistsHandler)),
});

export default compose(
  connect(null, mapDispatchToProps),
  withEmailConfirmation
)(SignUpScreen);