import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { Button } from 'react-native-paper';
import { Text, Alert } from 'react-native';
import styles from '../modal.styles';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { forgotPassword } from '@store/auth/auth.actions';
import { connect } from 'react-redux';
import { ForgotPasswordResult } from '@models/auth';
import { openModal } from '@store/modal/modal.actions';
import ConfirmNewPassword from '../ConfirmNewPassword/confirm-new-password.component';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface ForgotPasswordProps {
  forgotPassword: (email: string) => Promise<ForgotPasswordResult | undefined>;
  openModal: (element: React.ReactNode) => void;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onForgotPassword = async () => {
    setLoading(true);

    const response = await props.forgotPassword(email);

    if (response) {
      const { CodeDeliveryDetails: { AttributeName, Destination  } } = response;
      const info = 'Verefication code for password reset sent to ' +
        `${AttributeName} "${Destination}", please check it and follow further instructions`;

      Alert.alert(
        'Complete password reset',
        info,
        [{
          text: 'Ok',
          onPress: () => props.openModal(React.createElement(ConfirmNewPassword))
        }],
        { cancelable: false }
      );
    }

    setLoading(false);
  };

  return (
    <>
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.description}>
        Please enter your email address and we will send you confirmation
        code needed for reset your password
      </Text>
      
      <BasicTextField
        label='Email'
        value={email}
        onChangeText={setEmail}
      />

      <Button
        mode="outlined"
        loading={loading}
        disabled={loading}
        style={styles.confirmButton}
        color={Colors.primary}
        onPress={onForgotPassword}
      >
        Send code
      </Button>
    </>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  forgotPassword: (email: string) => dispatch(forgotPassword(email)),
  openModal: (element: React.ReactNode) => dispatch(openModal(element)),
})

export default connect(
  null,
  mapDispatchToProps
)(ForgotPassword);