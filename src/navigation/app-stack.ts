import EditProfileScreen from '@screens/EditProfile/edit-profile-screen';
import ProfileScreen from '@screens/Profile/profile-screen';
import UserListScreen from '@screens/UserList/user-list-screen';
import ChatScreen from '@screens/Chat/chat-screen';
import { createStackNavigator } from 'react-navigation-stack';

export const Screens = {
  UserList: {
    screen: UserListScreen,
    navigationOptions: {
      title: 'User list'
    }
  },
  Profile: ProfileScreen,
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      title: 'My profile'
    }
  },
  Chat: {
    screen: ChatScreen,
    navigationOptions: {
      title: 'Chat'
    }
  }
};

export const AppStack = createStackNavigator(Screens);