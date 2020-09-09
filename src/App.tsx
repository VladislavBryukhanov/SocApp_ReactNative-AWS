import React, { useEffect } from 'react';
import ModalDialog from '@components/ModalDialog/modal-dialog.component';
import { AppContainer } from './navigation';
import { connect } from 'react-redux';
import { AppState } from './store';

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { displayDataNotification } from '@helpers/displayDataNotification';
import { User } from '@models/user';
import { ChatRoom } from '@models/chat-room';

interface AppProps  {
  isAuthenticated?: boolean;
  cognitoUsername?: string;
  openedChat?: ChatRoom;
}

const App: React.FC<AppProps> = ({ isAuthenticated, openedChat, cognitoUsername }: AppProps) => {
  const notificationHandler = (message: FirebaseMessagingTypes.RemoteMessage) => {
    const sender: User = JSON.parse(message.data!.sender);
    const isCurrentChat = openedChat && openedChat.id === message.data!.chatId;
    const isSentByMe = sender.id === cognitoUsername;

    if (!isCurrentChat && !isSentByMe) {
      displayDataNotification(message.data!);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      return messaging().onMessage(notificationHandler);
    }
  }, [isAuthenticated, notificationHandler]);

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

export default connect(mapStateToProps)(App);