import React from 'react';
import { Dispatch } from 'redux';
import { Text, View, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { NavigationSwitchScreenProps, FlatList, withNavigation } from 'react-navigation';
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
import { getChatDetails, disposeChat } from '@store/chat-rooms/chat-rooms.actions';
import { ChatRoom } from '@models/chat-room';
import _ from 'lodash';

// ignore timer warnings which displayed due apollo subscription
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

// fixme replace to models
interface ListMessages {
  listMessages: {
    items: Message[]
  }
}

interface QueryListMessages {
  filter: {
    chatId: {
      eq?: string;
    }
  }
}

type NavigationParams = {
  chatId?: string;
  chatDetails?: ChatRoom;
  interlocutorId?: string;
}

interface ChatScreenProps extends NavigationSwitchScreenProps<NavigationParams> {
  userList: User[];
  profile: User;
  openedChatDetails: ChatRoom,
  chatCreating?: boolean;
  messages?: Message[];
  loading?: boolean;
  subscribeToNewMessages: (chatId: string) => () => void;
  getChatDetails: (chatId: string) => void;
  disposeChat: () => void;
}

interface ChatScreenState {
  isScrollBottomAvailable: boolean;
  isSubscriptionsEstablished: boolean;
}

class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  state: ChatScreenState = {
    isScrollBottomAvailable: false,
    isSubscriptionsEstablished: false,
  }

  lastVisibleItem?: Message;

  mesageListRef?: FlatList<Message>;
  unsubscribe?: () => void;

  componentDidMount() {
    const chatId = this.props.navigation.getParam('chatId');

    if (!chatId) return;

    this.unsubscribe = this.props.subscribeToNewMessages(chatId);
    this.setState({ isSubscriptionsEstablished: true });

    if (!this.props.openedChatDetails || this.props.openedChatDetails.id !== chatId) {
      this.props.getChatDetails(chatId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.props.disposeChat();
    }
  }

  static getDerivedStateFromProps(props: ChatScreenProps, state: ChatScreenState) {
    if (props.chatCreating) {
      return { ...state, isSubscriptionsEstablished: false }
    }

    return null;
  }

  componentDidUpdate(prevProps: ChatScreenProps) {
    const { openedChatDetails } = this.props;

    if (openedChatDetails && !_.isEqual(openedChatDetails, prevProps.openedChatDetails)) {
      this.unsubscribe && this.unsubscribe();
      this.unsubscribe = this.props.subscribeToNewMessages(openedChatDetails.id);

      this.props.navigation.setParams({ chatDetails: openedChatDetails });
      // subscription has some delay until established
      setTimeout(() => this.setState({ isSubscriptionsEstablished: true }), 1000);
    }
  }
  
  static navigationOptions = ({ navigation }: NavigationSwitchScreenProps<NavigationParams>) => ({
    title: navigation.state.params!.chatDetails && navigation.state.params!.chatDetails.name
  })

  messageTemplate = ({ item }: { item: Message }) => {
    const sentByMe = item.senderId === this.props.profile.id;
    const messageStyle = sentByMe 
      ? styles.outcomingMessage
      : styles.incomingMessage;

    // TODO all interlocutors will be replaced into Message table interlocutorIds: string[]
    const sender = sentByMe
      ? this.props.profile
      : this.props.userList.find(({ id }) => id === item.senderId)!;

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
    const { loading, messages, navigation } = this.props;

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
        <ChatInput 
          isSubscriptionsEstablished={this.state.isSubscriptionsEstablished}
          interlocutorId={navigation.getParam('interlocutorId')} 
          chatId={this.props.openedChatDetails && this.props.openedChatDetails.id}/>
      </View>
    );
  }
};

const mapApolloToProps = graphql<ChatScreenProps, ListMessages, QueryListMessages, {}>(listMessagesQuery, {
    options: (props: ChatScreenProps) => ({
      variables: {
        filter: {
          chatId: {
            eq: props.navigation.getParam('chatId')
          }
        }
      },
      fetchPolicy: 'cache-and-network'
    }),
    props: ({ data }) => ({
      loading: data!.loading,
      messages: data!.listMessages ? data!.listMessages.items : [],
      subscribeToNewMessages: (chatId: string) => data!.subscribeToMore({
        variables: { chatId },
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
  profile: store.usersModule.profile!,
  openedChatDetails: store.chatRoomsModule.openedChatDetails,
  chatCreating:  store.chatRoomsModule.chatLoading
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getChatDetails: (chatId: string) => dispatch(getChatDetails(chatId)),
  disposeChat: () => dispatch(disposeChat()),
});

export default compose<ChatScreenProps>(
  mapApolloToProps,
  connect(mapStateToProps, mapDispatchToProps),
  withNavigation
)(ChatScreen);
