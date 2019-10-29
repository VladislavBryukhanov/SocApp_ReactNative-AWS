import React, { useState } from 'react';
import { ScrollView, View, Button, Modal } from 'react-native';
import { NavigationParams } from 'react-navigation';
import styles from './styles';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createUser } from '../../store/users/users.actions';
import { Credentials } from '../../types/user';
import { Auth } from '../../api/auth';
import { BasicTextField } from '../../components/basic-text-field/basic-text-field.component';
import SignUpConfirmation from '../../components/sign-up-confirmation-code/sign-up-confirmation-code.component';

interface SignUpProps extends NavigationParams {
  createUser: (user: Credentials) => Promise<void>;
}

const SignUpScreen: React.FC<SignUpProps> = (props: SignUpProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [isConfirmation, setConfirmation] = useState(false);

  const onSignUp = () => {
    if (password !== confirmPassword) {
      return console.log('todo alert pass is not the same');
    }
    // await props.createUser({ email, password });
    // props.navigation.navigate('UserList');
    // const auth = new Auth();
    Auth.signUp({ email, password })
      .then(() => setConfirmation(true));
  }

  return (
    <>
      { isConfirmation && (
        <Modal visible={isConfirmation}>
          <SignUpConfirmation/>
        </Modal>
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