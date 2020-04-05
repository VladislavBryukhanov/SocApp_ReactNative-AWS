import React from 'react';
import { Text, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { NavigationSwitchScreenProps, FlatList } from 'react-navigation';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { FAB } from 'react-native-paper';
import moment from 'moment-mini';
import { debounce } from 'lodash';
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

// ignore timer warnings which displayed due apollo subscription
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

// fixme replace to models
interface ListMessages {
  listMessages: {
    items: Message[]
  }
}

interface ChatScreenProps extends NavigationSwitchScreenProps {
  userList: User[];
  profile: User;
  messages?: Message[];
  loading?: boolean;
  subscribeToNewMessages: () => () => void;
};

interface ChatScreenState {
  isScrollBottomAvailable: boolean;
}

class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  state: ChatScreenState = {
    isScrollBottomAvailable: false
  }

  lastVisibleItem?: Message;

  mesageListRef?: FlatList<Message>;
  unsubscribe?: () => void;

  componentDidMount() {
    this.unsubscribe = this.props.subscribeToNewMessages();
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  messageTemplate = ({ item }: { item: Message }) => {
    const sentByMe = item.senderKey.id === this.props.profile.id;
    const messageStyle = sentByMe 
      ? styles.outcomingMessage
      : styles.incomingMessage;

    let sender;

    if (item.senderKey.id === this.props.profile.id) {
      sender = this.props.profile;
    } else {
      // TODO all interlocutors will be replaced into Message table interlocutorIds: string[]
      sender = this.props.userList.find(({ id }) => id === item.senderKey.id)!;
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
            {moment(item.createdAt).format('HH:mm:ss')}
          </Text>
        </View>
      </View>
    );
  }

  // prevent displaying of button on new message event (button appears on few miliseconds before autoscroll scrolling 
  // down the same problem with keyboard appearing)
  setScrollableState = debounce((val) => this.setState({
    isScrollBottomAvailable: val
  }), 300);

  onListScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) => this.setScrollableState(event.nativeEvent.contentOffset.y > 0);

  onScrollBottom = () => {
    if (this.mesageListRef) {
      this.mesageListRef.scrollToIndex({ animated: true, index: 0 });
    }
  }

  render() {
    const { loading, messages } = this.props;

    if (loading || !messages) {
      return <Preloader/>;
    }

    const sortedMessages = [...messages].reverse();

    return (
      <View style={styles.chat}>
        <FlatList
          style={styles.messageList}
          keyExtractor={({ id }) => id}
          inverted
          data={sortedMessages}
          renderItem={this.messageTemplate}
          ref={(ref: FlatList<Message>) => this.mesageListRef = ref}
          onScroll={this.onListScroll}
        />
        { this.state.isScrollBottomAvailable && (
          <FAB 
            style={styles.srollBottomFab}
            icon='chevron-down'
            onPress={this.onScrollBottom}
            small/>
        )}
        <ChatInput/>
      </View>
    );
  }
};

const mapApolloToProps = graphql<{}, ListMessages, {}, {}>(listMessagesQuery, {
    props: ({ data }) => ({
      loading: data!.loading,
      messages: data!.listMessages ? data!.listMessages.items : [],
      subscribeToNewMessages: () => data!.subscribeToMore({
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
      })
    })
  }
)

const mapStateToProps = (store: AppState) => ({
  userList: store.usersModule.users,
  profile: store.usersModule.profile!
})

export default compose(
  mapApolloToProps,
  connect(mapStateToProps)
)(ChatScreen);
