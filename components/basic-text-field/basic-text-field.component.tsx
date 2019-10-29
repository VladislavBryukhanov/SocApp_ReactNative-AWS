
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import styles from './styles';

interface BasicTextFieldProps extends TextInputProps {
  label: string;
}

export const BasicTextField: React.FC<BasicTextFieldProps> = (props: BasicTextFieldProps) => (
  <>
    <Text style={styles.label}>
      {props.label}
    </Text>
    <TextInput 
      style={styles.textInput}
      {...props}
    />
  </>
)