import React, { useState } from 'react';
import { ScrollView, View, Button, Alert } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import styles from './styles';
import { createUser } from '../../store/users/users.actions';
import { Credentials } from '../../types/user';
import { Auth } from '../../api/auth';
import { BasicTextField } from '../../components/basic-text-field/basic-text-field.component';
import SignUpConfirmation from '../../components/sign-up-confirmation-code/sign-up-confirmation-code.component';
import { ModalDialog } from '../../components/modal-dialog/modal-dialog.component';
import { ToastAndroid } from 'react-native';

interface SignUpProps extends NavigationParams {
  createUser: (user: Credentials) => Promise<void>;
}

const SignUpScreen: React.FC<SignUpProps> = (props: SignUpProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [isConfirmation, setConfirmation] = useState(false);

  const onSignUp = async () => {
    if (password !== confirmPassword) {
      return ToastAndroid.show('The passwords do not match', ToastAndroid.LONG);
    }

    const user = await Auth.signUp({ email, password });
    if(user) {
      confirmRegistration();
    }
  }

  const confirmRegistration = () => {
    Alert.alert(
      'Complete registration',
      'Confirmation code sent to your inbox, please check it and input code',
      [{
        text: 'Ok',
        onPress: () => setConfirmation(true)
      }],
      {cancelable: false}
    )
  }

  const onRegestrationComplete = async () => {
    setConfirmation(false);
    await props.createUser({ email, password });
    props.navigation.navigate('UserList');
  }

  return (
    <>
      { isConfirmation && (
        <ModalDialog
          visible={isConfirmation}
          animationType={"slide"}
          onClose={() => setConfirmation(false)}
        >
          <SignUpConfirmation 
            credentials={{ email, password }}
            onComplete={onRegestrationComplete}
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
            onChangeText={(text: string) => setEmail(text)}
          />

          <BasicTextField
            label='Password'
            value={password}
            secureTextEntry={true}
            onChangeText={(text: string) => setPassword(text)}
          />
        
          <BasicTextField
            label='Confirm password'
            value={confirmPassword}
            secureTextEntry={true}
            onChangeText={(text: string) => setconfirmPassword(text)}
          />
        </View>

        <Button title="Sign up" onPress={onSignUp}/>
      </ScrollView>
    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createUser: (user: Credentials) => dispatch(createUser(user))
});

export default connect(
  null,
  mapDispatchToProps
)(SignUpScreen);