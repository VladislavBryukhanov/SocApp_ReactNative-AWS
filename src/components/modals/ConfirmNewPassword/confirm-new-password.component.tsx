import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { Text, View, Button, ToastAndroid, ScrollView } from 'react-native';
import styles from './styles';
import { BasicTextField } from '@components/BasicTextField/basic-text-field.component';
import { confirmNewPassword } from '@store/auth/auth.actions';
import { connect } from 'react-redux';
import { closeModal } from '@store/modal/modal.actions';

interface ConfirmNewPasswordProps {
  confirmNewPassword: (code: string, newPassword: string) => Promise<boolean>;
  closeModal: () => void;
}

const ConfirmNewPassword: React.FC<ConfirmNewPasswordProps> = (props: ConfirmNewPasswordProps) => {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onConfirmNewPassword = async () => {
    if (password !== confirmPassword) {
      return ToastAndroid.show('The passwords do not match', ToastAndroid.LONG);
    }
    
    const response = await props.confirmNewPassword(code, password);
    if (response) {
      ToastAndroid.show('Password changed successfully', ToastAndroid.LONG);
      props.closeModal();
    }
  };

  return (
    <ScrollView>
      <Text style={styles.title}>Confirm New Password</Text>
      <Text style={styles.description}>
        Please enter verification code, which sent to your email and new
        password that will replace the old
      </Text>
      
      <BasicTextField
        label='Verefication Code'
        value={code}
        onChangeText={setCode}
      />
      
      <BasicTextField
        label='New Password'
        value={password}
        secureTextEntry={true}
        onChangeText={setPassword}
      />
      
      <BasicTextField
        label='Confirm New Password'
        value={confirmPassword}
        secureTextEntry={true}
        onChangeText={setConfirmPassword}
      />

      <View style={styles.confirmButton}>
        <Button
          title="Change password"
          onPress={onConfirmNewPassword}
        />
      </View>
    </ScrollView>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  confirmNewPassword: (code: string, newPassword: string) =>
    dispatch(confirmNewPassword(code, newPassword)),
  closeModal: () => dispatch(closeModal())
})

export default connect(
  null,
  mapDispatchToProps
)(ConfirmNewPassword);