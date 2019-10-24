import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button } from 'react-native';
import { NavigationParams } from 'react-navigation';
import styles from './styles';

import uuidv4 from 'uuid/v4';
import API from '@aws-amplify/api';
import awsConfig from '../../aws-exports';
import apiParams from '../../amplify/backend/api/socAppApi/api-params.json';

interface SignInProps extends NavigationParams {}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = () => {
    props.navigation.navigate('UserList');

    API.configure(awsConfig);
    const init = {
      response: true,
      body: {
        id: uuidv4(),
        username: username
      }
    };
    API.post(apiParams.apiName, apiParams.paths[0].name, init)
  };

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

export default SignInScreen;