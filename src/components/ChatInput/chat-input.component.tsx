import React, { useState } from 'react';
import { View } from 'react-native';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { IconButton } from 'react-native-paper';
import { useMutation } from 'react-apollo';
import createMessageMutation from '../../api/graphql/mutations/createMessage.graphql';
import styles from './styles';
const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [addMessage, { loading }] = useMutation(createMessageMutation, {
    variables: {
      createmessageinput: {
        chatId: '9xNZWKEix0LrYvTl2IuIKZLWWsHzDMIJ',
        content: message,
      }
    },
    onCompleted: () => setMessage('')
  });

  return (
    <View style={styles.chatInput}>
      <BasicTextField
        style={styles.messageInput}
        placeholder="Enter message"
        value={message}
        onChangeText={setMessage}/>
        
      <IconButton
        size={22}
        icon='send'
        disabled={loading || !message}
        onPress={() => { addMessage(); }}
      />
    </View>
  );
}

export default ChatInput;