import React from 'react';
import { ScrollView, Image, Text } from 'react-native';
import defaultAvatar from '../../assets/icons/user.png';

const ProfileScreen: React.FC = () => (
  <ScrollView>
    <Image
      source={ defaultAvatar }
    />
    <Text>
      Username
    </Text>
    <Text>
      Bio
    </Text>
  </ScrollView>
)

export default ProfileScreen;