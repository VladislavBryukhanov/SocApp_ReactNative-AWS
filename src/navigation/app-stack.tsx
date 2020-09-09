import React from 'react';
import EditProfileScreen from '@screens/EditProfile/edit-profile-screen';
import ProfileScreen from '@screens/Profile/profile-screen';
import UserListScreen from '@screens/UserList/user-list-screen';
import ChatScreen from '@screens/Chat/chat-screen';
import ChatListScreen from '@screens/ChatList/chat-list.screen';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/Entypo';
import { customColors } from '@constants/theme';

const BottomNav = createMaterialBottomTabNavigator({
  UserList:  {
    screen: createStackNavigator({
      UserList: {
        screen: UserListScreen,
        navigationOptions: {
          title: 'User list',
        }
      }
    }),
    navigationOptions: {
      title: 'User list',
      tabBarColor: customColors.primary,
      shifting: true,
      tabBarIcon: () => (
        <Icon name="users" size={22} color='#ffffff'/>
      ),
    }
  },
  ChatList: {
    screen: createStackNavigator({
      ChatList: {
        screen: ChatListScreen,
        navigationOptions: {
          title: 'Chat list',
        }
      }
    }),
    navigationOptions: {
      title: 'Chat list',
      tabBarColor: customColors.secondary,
      shifting: true,
      tabBarIcon: () => (
        <Icon name="chat" size={22} color='#ffffff'/>
      ),
    }
  }
});

export const AppStack = createStackNavigator({
  Home: {
    screen: BottomNav,
    navigationOptions: {
      header: null
    }
  },
  EditProfile: {
    screen: EditProfileScreen,
    navigationOptions: {
      title: 'My profile',
    }
  },
  Profile: ProfileScreen,
  Chat: ChatScreen,
})
