
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { BasicTextField } from '../basic-text-field/basic-text-field.component';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { Auth } from '../../api/auth';
import { NavigationParams, withNavigation } from 'react-navigation';
import styles from './styles';

interface SignUpConfirmationProps extends NavigationParams {
  // congnitoUser: CognitoUser;
}

const SignUpConfirmation: React.FC<SignUpConfirmationProps> = (props: SignUpConfirmationProps) => {
  const [code, setCode] = useState('');
  // console.log(props.navigation.navigate);
  const onCompleteRegistration = async () => {
    await Auth.confirmEmail(code);
    props.navigation.navigate('UserList');
  }

  return (
    <View style={styles.modal}>
      <BasicTextField
        label='Confirmation code'
        value={code}
        onChangeText={(text: string) => setCode(text)}
      />
      <Button title="Complete registration" onPress={onCompleteRegistration}/>
    </View>
  )
}
export default withNavigation(SignUpConfirmation);