import SignUpScreen from '@screens/SignUp/sign-up-screen';
import SignInScreen from '@screens/SignIn/sign-in-screen';
import { createStackNavigator } from 'react-navigation-stack';

export const AuthStack = createStackNavigator({
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