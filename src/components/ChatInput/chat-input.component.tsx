import React, { useState, useEffect, useRef } from 'react';
import { View, Image } from 'react-native';
import { useMutation } from 'react-apollo';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton } from 'react-native-paper';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { createChat } from '@store/chat-rooms/chat-rooms.actions';
import { AppState } from '@store/index';
import createMessageMutation from '../../api/graphql/mutations/createMessage.graphql';
import preloader2 from '@assets/preloaders/preloader2.gif';
import styles from './styles';

interface ChatInputProps {
  chatId?: string;
  interlocutorId?: string;
  chatLoading?: boolean;
  refetchChat: () => Promise<void>;
}

// FIXME WIP
const usePrevious = (value: any) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

const ChatInput: React.FC<ChatInputProps> = (props: ChatInputProps) => {
  const dispatch = useDispatch();
  const chatCreating = useSelector((store: AppState) => store.chatRoomsModule.chatCreating);
  const prevChatCreatingProp = usePrevious(chatCreating);

  // console.log("CUR CH CR", chatCreating)
  // console.log("PREV CH CR", prevChatCreatingProp)

  const [creationStage, updateCreationStage] = useState(prevChatCreatingProp && !chatCreating);
  // console.log("CCS", creationStage)

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
    if (message && props.chatId) {
      addMessage().then(() => props.refetchChat());
    }
  }, [props.chatId]);

  const onSend = () => {
      // "create chat if not exists"
    if (!props.chatId && props.interlocutorId) {
      return dispatch(createChat({ interlocutorId: props.interlocutorId }));
    }

    addMessage();
  };

  if (props.chatLoading || creationStage) {
    return (
      <View style={styles.chatInput}>
        <BasicTextField
          style={styles.messageInput}
          placeholder='Chat loading...'/>
        <Image source={preloader2} style={styles.preloader}/> 
      </View>
    )
  }

  return (
    <View style={styles.chatInput}>
      <BasicTextField
        style={styles.messageInput}
        placeholder='Enter message'
        value={message}
        onChangeText={setMessage}
      />

      <IconButton
        size={22}
        icon='send'
        disabled={loading || !message}
        onPress={onSend}
      />
    </View>
  );
}

export default ChatInput;