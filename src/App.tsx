import React, { useEffect } from 'react';
import ModalDialog from '@components/ModalDialog/modal-dialog.component';
import { AppContainer } from './navigation';
import { connect } from 'react-redux';
import { AppState } from './store';

import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { displayDataNotification } from '@helpers/displayDataNotification';
import { User } from '@models/user';

interface AppProps  {
  isAuthenticated?: boolean;
  cognitoUsername?: string;
  openedChat: string | null;
}

const App: React.FC<AppProps> = ({ isAuthenticated, openedChat, cognitoUsername }: AppProps) => {
  const notificationHandler = (message: FirebaseMessagingTypes.RemoteMessage) => {
    const sender: User = JSON.parse(message.data!.sender);
    const isCurrentChat = openedChat === message.data!.chatId;
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
  openedChat: store.appSharedModule.openedChat,
});

export default connect(mapStateToProps)(App);