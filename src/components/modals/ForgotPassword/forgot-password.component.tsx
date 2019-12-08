import React, { useState } from 'react';
import { Dispatch } from 'redux';
import { Text, View, Button } from 'react-native';
import styles from './styles';
import { BasicTextField } from '@components/BasicTextField/basic-text-field.component';
import { forgotPassword } from '@store/auth/auth.actions';
import { connect } from 'react-redux';

interface ForgotPasswordProps {
  forgotPassword: (email: string) => Promise<boolean>;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = (props: ForgotPasswordProps) => {
  console.log(props);
  const [email, setEmail] = useState('');
  const onForgotPassword = () => props.forgotPassword(email);

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

      <View style={styles.confirmButton}>
        <Button
          title="Send code"
          onPress={onForgotPassword}
        />
      </View>
    </>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  forgotPassword: (email: string) => dispatch(forgotPassword(email))
})

export default connect(
  null,
  mapDispatchToProps
)(ForgotPassword);