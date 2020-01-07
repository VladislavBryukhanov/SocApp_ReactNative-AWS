import React from 'react';
import {AppRegistry} from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import { Provider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import { store } from '@store/index';

const AppWithRedux: React.FC = () => (
  <Provider store={store}>
    <PaperProvider>
      <App/>
    </PaperProvider>
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppWithRedux);
