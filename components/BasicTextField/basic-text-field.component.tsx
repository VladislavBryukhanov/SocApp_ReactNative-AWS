
import React from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import styles from './styles';

interface BasicTextFieldProps extends TextInputProps {
  label: string;
  description?: string;
}

export const BasicTextField: React.FC<BasicTextFieldProps> = (props: BasicTextFieldProps) => (
  <>
    <Text style={styles.label}>
      {props.label}
    </Text>
    { props.description && (
        <Text style={styles.description}>
          {props.description}
        </Text>
    )}
    <TextInput 
      style={styles.textInput}
      {...props}
    />
  </>
)