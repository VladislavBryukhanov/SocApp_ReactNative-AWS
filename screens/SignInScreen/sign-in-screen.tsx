import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button } from 'react-native';
import { NavigationParams } from 'react-navigation';
import styles from './styles';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createUser } from '../../store/users/users.actions';
import { User } from '../../types/user';

interface SignInProps extends NavigationParams {
  createUser: (user: User) => Promise<void>;
}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = () => {
    props.navigation.navigate('UserList');
    props.createUser({ username });
  }

  return (
    <ScrollView style={styles.scrollView}>

      <View style={styles.authForm}>
        <Text style={styles.label}>
          Login
        </Text>
        <TextInput 
          style={styles.textInput}
          value={username}
          onChangeText={(text: string) => setUsername(text)}/>

        <Text style={styles.label}>
          Password
        </Text>
        <TextInput 
          style={styles.textInput}
          value={password}
          onChangeText={(text: string) => setPassword(text)}/>
      </View>
      
      <Button title="Sign in" onPress={onSignIn}/>
    </ScrollView>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  createUser: (user: User) => dispatch(createUser(user))
});

export default connect(
  null,
  mapDispatchToProps
)(SignInScreen);