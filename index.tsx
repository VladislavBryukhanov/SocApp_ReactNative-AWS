import React from 'react';
import { AppRegistry } from 'react-native';
import firebase from '@react-native-firebase/app';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider as PaperProvider } from 'react-native-paper';
import { apolloClient } from '@api/graphql';
import { store } from '@store/index';
import { theme } from '@constants/theme';
import App from './src/App';
import { name as appName } from './app.json';

import messaging from '@react-native-firebase/messaging';
import { displayDataNotification } from '@helpers/displayDataNotification';
import firebaseConfig from './firebaseConfig.json';
import { CognitoAuth } from '@api/auth';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AppWithRedux: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <App/>
      </PaperProvider>
    </Provider>
  </ApolloProvider>
);

messaging().setBackgroundMessageHandler(async message => {
  await CognitoAuth.retrieveAuthenticatedUser();
  await CognitoAuth.updateAWSConfig();
  displayDataNotification(message.data!);
});

AppRegistry.registerComponent(appName, () => AppWithRedux);
