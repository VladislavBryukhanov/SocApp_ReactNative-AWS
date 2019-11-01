import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SignInScreen from './screens/SignIn/sign-in-screen';
import UserListScreen from './screens/UserList/user-list-screen';
import ProfileScreen from './screens/Profile/profile-screen';
import SignUpScreen from './screens/SignUp/sign-up-screen';
import ModalDialog from './components/modal-dialog/modal-dialog.component';
import { View } from 'react-native';

const ScreenNavigation = createStackNavigator({
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
  UserList: { 
    screen: UserListScreen,
    navigationOptions: {
      title: 'User list'
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      title: '[NAME] Profile'
    }
  }
});

const AppScreens = createAppContainer(ScreenNavigation);

const App: React.FC = () => (
  <>
    <AppScreens/>
    <ModalDialog/>
  </>
)

export default App;