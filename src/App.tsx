import React, { useEffect, useState } from 'react';
import ModalDialog from '@components/ModalDialog/modal-dialog.component';
import { AppContainer } from './navigation';
import { connect } from 'react-redux';
import { AppState } from './store';

import messaging from '@react-native-firebase/messaging';
import { displayDataNotification } from '@helpers/displayDataNotification';

interface AppProps {
  isAuthenticated?: boolean;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  const [unsubscribe, setUnsubscribe] = useState<() => void>();

  const registerPushNotifications = () => {
    const unsub = messaging().onMessage(async message =>
        displayDataNotification(message.data!)
    );

    setUnsubscribe(() => unsub);
  };

  const unregisterPushNotifications = () => {
    unsubscribe && unsubscribe();
  }

  useEffect(() => {
    if (!props.isAuthenticated) {
      return unregisterPushNotifications();
    }
    registerPushNotifications();
  }, [props.isAuthenticated]);

  return (
    <>
      <AppContainer/>
      <ModalDialog/>
    </>
  );
};

const mapStateToProps = (store: AppState) => ({
  isAuthenticated: store.authModule.isAuthenticated
});

export default connect(mapStateToProps)(App);
