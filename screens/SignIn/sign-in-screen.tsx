import React, { useState } from 'react';
import { ScrollView, View, Button, Text } from 'react-native';
import { NavigationParams } from 'react-navigation';
import styles from './styles';
import baseStyles from '../../components/base.styles';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Credentials } from '../../types/user';
import { BasicTextField } from '../../components/basic-text-field/basic-text-field.component';
import { signIn } from '../../store/auth/auth.actions';

interface SignInProps extends NavigationParams {
  signIn: (user: Credentials) => Promise<boolean>;
}

const SignInScreen: React.FC<SignInProps> = (props: SignInProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignIn = async () => {
    const user = await props.signIn({ email, password });
    if (user) {
      props.navigation.navigate('UserList');
    }
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
      
      <Text onPress={goToSignUp} style={baseStyles.linkButton}>
        Sign up
      </Text>
      
    </ScrollView>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signIn: (credentials: Credentials) => dispatch(signIn(credentials)),
});

export default connect(
  null,
  mapDispatchToProps
)(SignInScreen);