import React from 'react';
import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { ApolloProvider } from '@apollo/react-hooks';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { store } from '@store/index';
import { apolloClient } from '@api/graphql';
import { theme } from '@constants/theme';

const AppWithRedux: React.FC = () => (
  <ApolloProvider client={apolloClient}>
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <App/>
      </PaperProvider>
    </Provider>
  </ApolloProvider>
);

AppRegistry.registerComponent(appName, () => AppWithRedux);
