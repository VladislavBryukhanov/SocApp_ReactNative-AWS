import React from 'react';
import { ScrollView, Image, Text } from 'react-native';
import { NavigationParams } from 'react-navigation';
import defaultAvatar from '../../assets/icons/user.png';

interface ProfileScreeProps extends NavigationParams {}

const ProfileScreen: React.FC<ProfileScreeProps> = (props: ProfileScreeProps) => {
  const user = props.navigation.getParam('user');
  const avatar = user.avatar
    ? { uri: user.avatar } : defaultAvatar;

  return (
    <ScrollView>
      <Image source={ avatar }/>
      <Text>
        {user.username}
      </Text>
      <Text>
        Bio
      </Text>
    </ScrollView>
  )
}

export default ProfileScreen;