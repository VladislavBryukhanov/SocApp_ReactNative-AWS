import EditProfileScreen from '@screens/EditProfile/edit-profile-screen';
import ProfileScreen from '@screens/Profile/profile-screen';
import UserListScreen from '@screens/UserList/user-list-screen';
import { createStackNavigator } from 'react-navigation-stack';

export const Screens = {
  UserList: {
    screen: UserListScreen,
    navigationOptions: {
      title: 'User list'
    }
  },
  Profile: ProfileScreen,
  EditProfile: EditProfileScreen
};

export const AppStack = createStackNavigator(Screens);