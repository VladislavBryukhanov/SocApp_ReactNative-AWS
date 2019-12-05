
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { BasicTextField } from '../../BasicTextField/basic-text-field.component';
import { Credentials } from '../../../types/user';
import styles from './styles';
import baseStyles from '../../base.styles';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { confirmEmail, resendConfirmationCode } from '../../../store/auth/auth.actions';

interface SignUpConfirmationProps {
  credentials: Credentials,
  onComplete: () => void,
  confirmEmail: (code: string, credentials: Credentials) => Promise<boolean>;
  resendConfirmationCode: (credentials: Credentials) => Promise<boolean>;
}

const SignUpConfirmation: React.FC<SignUpConfirmationProps> = (props: SignUpConfirmationProps) => {
  const [code, setCode] = useState('');
  
  const onCompleteRegistration = async () => {
    const res = await props.confirmEmail(code, props.credentials);
    if (res) {
      props.onComplete();
    }
  }

  const onSendCodeAgaint = () => {
    props.resendConfirmationCode(props.credentials);
    Alert.alert(
      'Complete registration',
      'Confirmation code sent to your inbox, please check it and input code',
    );
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

      <Text onPress={onSendCodeAgaint} style={baseStyles.linkButton}>
        Send confirmation code again
      </Text>

    </>
  )
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  confirmEmail: (code: string, credentials: Credentials) =>
    dispatch(confirmEmail(code, credentials)),
  resendConfirmationCode: (credentials: Credentials) => 
    dispatch(resendConfirmationCode(credentials))
})

export default connect(
  null,
  mapDispatchToProps
)(SignUpConfirmation);