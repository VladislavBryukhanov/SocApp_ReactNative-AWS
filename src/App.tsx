import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AuthLoadingScreen from '@screens/AuthLoading/auth-loading-screen';
import SignInScreen from '@screens/SignIn/sign-in-screen';
import UserListScreen from '@screens/UserList/user-list-screen';
import ProfileScreen from '@screens/Profile/profile-screen';
import SignUpScreen from '@screens/SignUp/sign-up-screen';
import ModalDialog from '@components/ModalDialog/modal-dialog.component';

const AppStack = createStackNavigator({
  UserList: { 
    screen: UserListScreen,
    navigationOptions: {
      title: 'User list'
    }
  },
  Profile: ProfileScreen
});

const AuthStack = createStackNavigator({
  SignIn: { 
    screen: SignInScreen,
    navigationOptions: {
      header: null
    }
  },
  SignUp: { 
    screen: SignUpScreen,
    navigationOptions: {
      title: 'Sign up'
    }
  },
});

const AppContainer = createAppContainer(
  createSwitchNavigator({
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack
    }, { initialRouteName: 'AuthLoading' }
  )
)

const App: React.FC = () => (
  <>
    <AppContainer/>
    <ModalDialog/>
  </>
)

export default App;