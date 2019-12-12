
import React, { useState } from 'react';
import { View, Button, Text, Alert } from 'react-native';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BasicTextField } from '@components/BasicTextField/basic-text-field.component';
import baseStyles from '@components/base.styles';
import { Credentials } from '@models/user';
import { confirmEmail, resendConfirmationCode } from '@store/auth/auth.actions';
import styles from './styles';

interface SignUpConfirmationProps {
  onComplete: () => void,
  confirmEmail: (code: string) => Promise<boolean>;
  resendConfirmationCode: (credentials: Credentials) => Promise<boolean>;
}

const SignUpConfirmation: React.FC<SignUpConfirmationProps> = (props: SignUpConfirmationProps) => {
  const [code, setCode] = useState('');
  
  const onCompleteRegistration = async () => {
    const res = await props.confirmEmail(code);
    if (res) {
      props.onComplete();
    }
  }

  const onSendCodeAgaint = () => {
    props.resendConfirmationCode();
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
  confirmEmail: (code: string) =>
    dispatch(confirmEmail(code)),
  resendConfirmationCode: () => 
    dispatch(resendConfirmationCode())
})

export default connect(
  null,
  mapDispatchToProps
)(SignUpConfirmation);