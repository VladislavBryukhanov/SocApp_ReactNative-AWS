import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { AppState } from './store';
import { AppContainer } from './navigation';
import ModalDialog from '@components/ModalDialog/modal-dialog.component';
import { updateChatLastMessage } from '@store/chat-rooms/chat-rooms.actions';
import { displayDataNotification } from '@helpers/displayDataNotification';
import { User } from '@models/user';
import { Message } from '@models/message';
import { ChatRoom } from '@models/chat-room';

interface AppProps  {
  isAuthenticated?: boolean;
  cognitoUsername?: string;
  openedChat?: ChatRoom;
  updateChatLastMessage: (lastMessage: Message) => void;
}

const App: React.FC<AppProps> = ({ isAuthenticated, openedChat, cognitoUsername, updateChatLastMessage }: AppProps) => {
  const notificationHandler = (notification: FirebaseMessagingTypes.RemoteMessage) => {
    const { sender: senderJSON, chatId, createdAt, message, messageId } = notification.data!;
    const sender: User = JSON.parse(senderJSON);

    const isCurrentChat = openedChat && openedChat.id === chatId;
    const isSentByMe = sender.id === cognitoUsername;
    
    updateChatLastMessage({ 
      id: messageId,
      senderId: sender.id!,
      chatId,
      content: message,
      createdAt,
      isRead: false
    });

    if (!isCurrentChat && !isSentByMe) {
      displayDataNotification(notification.data!);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      return messaging().onMessage(notificationHandler);
    }
  }, [isAuthenticated]);

  return (
    <>
      <AppContainer/>
      <ModalDialog/>
    </>
  );
};

const mapStateToProps = (store: AppState) => ({
  isAuthenticated: store.authModule.isAuthenticated,
  cognitoUsername: store.authModule.cognitoUsername,
  openedChat: store.chatRoomsModule.openedChatDetails,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateChatLastMessage: (lastMessage: Message) => dispatch(updateChatLastMessage(lastMessage))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);