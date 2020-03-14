import React, { useEffect, useState } from 'react';
// import { graphql, useQuery } from 'react-apollo'
import { Text, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { NavigationSwitchScreenProps, FlatList } from 'react-navigation';
import { connect } from 'react-redux';
import { FAB } from 'react-native-paper';
import { useQuery } from '@apollo/react-hooks';
import { Message } from '@models/message';
import { User } from '@models/user';
import { AppState } from '@store/index';
import onCreateMessageSubscription from '../../api/graphql/subscriptions/onCreateMessage.graphql';
import listMessagesQuery from '../../api/graphql/queries/listMessages.graphql';
import { CachedImageLoaded } from '@components/atoms/CachedImageLoaded/cached-image-loaded.component';
import { Preloader } from '@components/atoms/Prloader/preloader.component';
import ChatInput from '@components/ChatInput/chat-input.component';
import defaultAvatar from '@assets/icons/user.png';
import styles from './styles';
import { debounce } from 'lodash';
import moment from 'moment-mini';
// fixme replace to models
interface ListMessages {
  listMessages: {
    items: Message[]
  }
}

interface ChatScreenProps  extends NavigationSwitchScreenProps {
  userList: User[],
  profile: User
};

const ChatScreen: React.FC<ChatScreenProps> = (props: ChatScreenProps) => {
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

  const messageTemplate = ({ item }: { item: Message }) => {
    const sentByMe = item.senderId === props.profile.id;
    const messageStyle = sentByMe 
      ? styles.outcomingMessage
      : styles.incomingMessage;

    let sender;

    if (item.senderId === props.profile.id) {
      sender = props.profile;
    } else {
      // TODO all interlocutors will be replaced into Message table interlocutorIds: string[]
      sender = props.userList.find(({ id }) => id === item.senderId)!;
    }

    return (
      <View style={[styles.messageView, sentByMe && styles.reversed]}>
        <View style={styles.sender}>
          <CachedImageLoaded
            imageUrl={sender.avatar}
            style={styles.avatar}
            defaultImage={defaultAvatar}
          />
        </View>
        <View style={[ styles.message, messageStyle]}>
          <Text style={styles.content}>{item.content}</Text>
        </View>
        <View style={styles.dateTimeView}>
          <Text style={styles.dateTime}>
            {moment(item.createdAt).format('DD MMM')}
          </Text>
          <Text style={styles.dateTime}>
            {moment(item.createdAt).format('HH:MM:ss')}
          </Text>
        </View>
      </View>
    );
  }

  // prevent displaying of button on new message event (button appears on few miliseconds before autoscroll scrolling 
  // down the same problem with keyboard appearing)
  const setScrollableState = debounce((val) => setIsScrollBottomAvailable(val), 300);

  const onListScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { nativeEvent: { contentSize, layoutMeasurement, contentOffset } } = event;
    const endPosition = contentSize.height - layoutMeasurement.height;

    if (contentOffset.y === endPosition || endPosition < 0) {
      setScrollableState(false);
    } else if (!isScrollBottomAvailable) {
      setScrollableState(true);
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

const mapStateToProps = (store: AppState) => ({
  userList: store.usersModule.users,
  profile: store.usersModule.profile!
})

export default connect(mapStateToProps)(ChatScreen);