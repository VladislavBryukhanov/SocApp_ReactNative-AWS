import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button } from 'react-native';
import { NavigationParams } from 'react-navigation';
import styles from './styles';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createUser } from '../../store/users/users.actions';
import { Credentials } from '../../types/user';
import { Auth } from '../../api/auth';

interface SignInProps extends NavigationParams {
  createUser: (user: Credentials) => Promise<void>;
}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = async () => {
    // await props.createUser({ email, password });
    // props.navigation.navigate('UserList');
    const auth = new Auth();
    await auth.signUp(email, password);
    // await auth.confirmEmail(code);
  }

  return (
    <ScrollView
      keyboardShouldPersistTaps='handled'
      style={styles.scrollView}
    >

      <View style={styles.authForm}>
        <Text style={styles.label}>
          Email
        </Text>
        <TextInput 
          style={styles.textInput}
          value={email}
          onChangeText={(text: string) => setEmail(text)}/>

        <Text style={styles.label}>
          Password
        </Text>
        <TextInput 
          style={styles.textInput}
          secureTextEntry={true}
          value={password}
          onChangeText={(text: string) => setPassword(text)}/>
      </View>
      
      <Button title="Sign in" onPress={onSignIn}/>
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