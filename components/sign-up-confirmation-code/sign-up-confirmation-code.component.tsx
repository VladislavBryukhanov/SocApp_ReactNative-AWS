
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { BasicTextField } from '../basic-text-field/basic-text-field.component';
import { Auth } from '../../api/auth';
import { Credentials } from '../../types/user';
import styles from './styles';

interface SignUpConfirmationProps {
  credentials: Credentials,
  onComplete: () => void
}

const SignUpConfirmation: React.FC<SignUpConfirmationProps> = (props: SignUpConfirmationProps) => {
  const [code, setCode] = useState('');
  
  const onCompleteRegistration = async () => {
    await Auth.confirmEmail(code, props.credentials);
    props.onComplete();
  }

  return (
    <>
      <BasicTextField
        label='Confirmation code'
        value={code}
        onChangeText={(text: string) => setCode(text)}
      />

      <View style={styles.confirmButton}>
        <Button
          title="Complete registration"
          onPress={onCompleteRegistration}
        />
      </View>
    </>
  )
}
export default SignUpConfirmation;