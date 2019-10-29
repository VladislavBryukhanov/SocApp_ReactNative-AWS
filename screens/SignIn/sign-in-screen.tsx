import React, { useState } from 'react';
import { ScrollView, View, Button, Text } from 'react-native';
import { NavigationParams } from 'react-navigation';
import styles from './styles';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createUser } from '../../store/users/users.actions';
import { Credentials } from '../../types/user';
import { Auth } from '../../api/auth';
import { BasicTextField } from '../../components/basic-text-field/basic-text-field.component';

interface SignInProps extends NavigationParams {
  // createUser: (user: Credentials) => Promise<void>;
}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = () => {
    Auth.signIn({ email, password })
      .then(() => props.navigation.navigate('UserList'));
  }

  const goToSignUp = () => {
    props.navigation.navigate('SignUp');
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
      
      <Text onPress={goToSignUp} style={styles.linkButton}>
        Sign up
      </Text>
      
    </ScrollView>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createUser: (user: Credentials) => dispatch(createUser(user))
});

export default connect(
  null,
  mapDispatchToProps
)(SignInScreen);