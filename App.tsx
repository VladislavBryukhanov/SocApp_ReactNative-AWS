import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import SignInScreen from './screens/SignIn/sign-in-screen';
import UserListScreen from './screens/UserList/user-list-screen';
import ProfileScreen from './screens/Profile/profile-screen';
import signUpScreen from './screens/SignUp/sign-up-screen';

const ScreenNavigation = createStackNavigator({
  Home: { 
    screen: SignInScreen,
    navigationOptions: {
      header: null
    }
  },
  SignUp: { 
    screen: signUpScreen,
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

const App = createAppContainer(ScreenNavigation);

export default App;