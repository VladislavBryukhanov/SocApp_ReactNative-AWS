import AuthLoadingScreen from '@screens/AuthLoading/auth-loading-screen';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { AuthStack } from './auth-stack';
import { AppStack } from './app-stack';

export const AppContainer = createAppContainer(
  createSwitchNavigator({
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    }, { initialRouteName: 'AuthLoading' }
  )
);
