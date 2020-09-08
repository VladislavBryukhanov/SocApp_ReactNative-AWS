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
import { ListMessages, QueryListMessages } from '@models/gql-results/list-messages-query';
import _ from 'lodash';

// ignore timer warnings which displayed due apollo subscription
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Setting a timer']);

type NavigationParams = {
  chatId?: string;
  chatDetails?: ChatRoom;
  interlocutorId?: string;
}

interface ChatScreenProps extends NavigationSwitchScreenProps<NavigationParams> {
  userList: User[];
  profile: User;
  openedChatDetails: ChatRoom,
  messages?: Message[];
  loading?: boolean;
  refetch: (chatId: string) => Promise<void>;
  subscribeToNewMessages: (chatId: string) => () => void;
  getChatDetails: (chatId: string) => void;
  disposeChat: () => void;
}

interface ChatScreenState {
  isScrollBottomAvailable: boolean;
}

class ChatScreen extends React.Component<ChatScreenProps, ChatScreenState> {
  state: ChatScreenState = {
    isScrollBottomAvailable: false,
  }

  lastVisibleItem?: Message;

  mesageListRef?: FlatList<Message>;
  unsubscribe?: () => void;

  componentDidMount() {
    const chatId = this.props.navigation.getParam('chatId');

    if (!chatId) return;

    if (!this.props.openedChatDetails || this.props.openedChatDetails.id !== chatId) {
      return this.props.getChatDetails(chatId);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.props.disposeChat();
    }
  }

  componentDidUpdate(prevProps: ChatScreenProps) {
    const { openedChatDetails } = this.props;

    if (openedChatDetails && !_.isEqual(openedChatDetails, prevProps.openedChatDetails)) {
      this.unsubscribe = this.props.subscribeToNewMessages(openedChatDetails.id);
      this.props.navigation.setParams({ chatDetails: openedChatDetails });
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

  ChatList = () => {
    const { loading, messages } = this.props;
    if (loading || !messages) return <Preloader/>;

    const sortedMessages = [...messages].reverse();

    return <>
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
    </>
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
    const { loading, navigation, openedChatDetails } = this.props;
    const chatId = openedChatDetails && openedChatDetails.id;

    return (
      <View style={styles.chat}>
        <this.ChatList/>
        <ChatInput
          chatLoading={loading}
          interlocutorId={navigation.getParam('interlocutorId')} 
          refetchChat={() => this.props.refetch(chatId)}
          chatId={chatId}/>
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
      refetch: (chatId: string) => data!.refetch({
        filter: {
          chatId: {
            eq: chatId
          }
        },
      }),
      loading: data!.loading,
      messages: data!.listMessages ? data!.listMessages.items : [],
      subscribeToNewMessages: (chatId: string) => data!.subscribeToMore({
        variables: { chatId },
        document: onCreateMessageSubscription,
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data.onCreateMessage) return prev;
          
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
