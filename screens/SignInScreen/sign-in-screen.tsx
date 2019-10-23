import React from 'react';
import { ScrollView, View, Text, TextInput, Button } from 'react-native';
import styles from './styles';
import { NavigationParams } from 'react-navigation';

interface SignInProps extends NavigationParams {}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const onSignIn = () => {
    props.navigation.navigate('UserList');
  };

  return (
    <ScrollView style={styles.scrollView}>

    <View style={styles.authForm}>
      <Text style={styles.label}>
        Login
      </Text>
      <TextInput style={styles.textInput}/>

      <Text style={styles.label}>
        Password
      </Text>
      <TextInput style={styles.textInput}/>
    </View>
    
    <Button title="Sign in" onPress={onSignIn}/>
  </ScrollView>
  )
}

export default SignInScreen;