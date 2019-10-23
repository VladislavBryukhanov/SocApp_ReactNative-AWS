import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SignInScreen from './screens/SignInScreen/sign-in-screen';
import UserListScreen from './screens/UserListScreen/user-list-screen';
import ProfileScreen from './screens/ProfileScreen/profile-screen';

const ScreenNavigation = createStackNavigator({
  Home: { 
    screen: SignInScreen,
    navigationOptions: {
      header: null
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

const App = createAppContainer(ScreenNavigation);

export default App;