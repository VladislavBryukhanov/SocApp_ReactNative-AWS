import React, { useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { IconButton } from 'react-native-paper';
import { useMutation } from 'react-apollo';
import createMessageMutation from '../../api/graphql/mutations/createMessage.graphql';
import styles from './styles';
import { useDispatch } from 'react-redux';
import { createChat } from '@store/chat-rooms/chat-rooms.actions';
import preloader2 from '@assets/preloaders/preloader2.gif';

interface ChatInputProps {
  chatId?: string;
  interlocutorId?: string;
  isSubscriptionsEstablished?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = (props: ChatInputProps) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState('');
  const [addMessage, { loading }] = useMutation(createMessageMutation, {
    variables: {
      createmessageinput: {
        chatId: props.chatId,
        content: message,
      }
    },
    onCompleted: () => setMessage('')
  });

  useEffect(() => {
    if (message && props.chatId && props.isSubscriptionsEstablished) {
      addMessage();
    }
  }, [props.chatId, props.isSubscriptionsEstablished]);

  const onSend = () => {
      // "create chat if not exists"
    if (!props.chatId && props.interlocutorId) {
      return dispatch(createChat({ interlocutorId: props.interlocutorId }));
    }

    addMessage();
  };
  const chatDoNotExists = !props.chatId && props.interlocutorId;

  return (
    <View style={styles.chatInput}>
      <BasicTextField
        style={styles.messageInput}
        placeholder='Enter message'
        value={message}
        onChangeText={setMessage}/>

      {props.isSubscriptionsEstablished || chatDoNotExists ? (
          <IconButton
            size={22}
            icon='send'
            disabled={loading || !message}
            onPress={onSend}
          />
        ) : <Image source={preloader2} style={styles.preloader}/>
      }  
    </View>
  );
}

export default ChatInput;