import React, { useEffect, useState } from 'react';
// import { graphql, useQuery } from 'react-apollo'
import { useQuery } from '@apollo/react-hooks';
import { NavigationSwitchScreenProps, FlatList } from 'react-navigation';
import { Text, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Message } from '@models/message';
import styles from './styles';
import listMessagesQuery from '../../api/graphql/queries/listMessages.graphql';
import onCreateMessageSubscription from '../../api/graphql/subscriptions/onCreateMessage.graphql';
import { Preloader } from '@components/atoms/Prloader/preloader.component';
import { ChatInput } from '@components/ChatInput/chat-input.component';
import { FAB } from 'react-native-paper';

interface ListMessages {
  listMessages: {
    items: Message[]
  }
}

interface ChatScreenProps  extends NavigationSwitchScreenProps {};

export const ChatScreen: React.FC<ChatScreenProps> = (props: ChatScreenProps) => {
  let mesageListRef: FlatList<Message> | undefined;

  const [ isScrollBottomAvailable, setIsScrollBottomAvailable ] = useState(true);
  const { loading, data, subscribeToMore } = useQuery<ListMessages>(listMessagesQuery);

  useEffect(() => subscribeToMore<{ onCreateMessage: Message }>({
    document: onCreateMessageSubscription,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      
      return {
        ...prev,
        listMessages: {
          ...prev.listMessages,
          items: [
            ...prev.listMessages.items,
            subscriptionData.data.onCreateMessage
          ]
        }
      };
    }
  }), []);

  if (loading || !data) {
    return <Preloader/>;
  }

  const messageTemplate = ({ item }: { item: Message }) => (
    <View style={styles.message}>
      {/* <Text>{item.chatId}</Text>
      <Text>{item.senderId}</Text> */}
      <Text style={styles.content}>{item.content}</Text>
      <Text>{item.timestamp}</Text>
    </View>
  )

  const onListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent: { contentSize, layoutMeasurement, contentOffset } } = event;
    const endPosition = contentSize.height - layoutMeasurement.height;
    
    if (contentOffset.y === endPosition) {
      setIsScrollBottomAvailable(false);
    } else if (!isScrollBottomAvailable) {
      setIsScrollBottomAvailable(true);
    }
  };

  const onScrollBottom = () => {
    if (mesageListRef) {
      mesageListRef.scrollToEnd({ animated: true});
    }
  }

  const onMesageCountChanged = () => {
    if (!isScrollBottomAvailable) {
      onScrollBottom();
    }
  }

  return (
    <View style={styles.chat}>
      <FlatList
        style={styles.messageList}
        data={data.listMessages.items}
        renderItem={messageTemplate}
        ref={(ref:  FlatList<Message>) => mesageListRef = ref}
        // onLayout={onScrollBottom}
        onContentSizeChange={onMesageCountChanged}
        onScroll={onListScroll}
      />
      { isScrollBottomAvailable && (
        <FAB 
          style={styles.srollBottomFab}
          icon='chevron-down'
          onPress={onScrollBottom}
          small/>
      )}
      <ChatInput/>
    </View>
  )
};