import React from 'react';
import { ScrollView, Image, Text } from 'react-native';

const mockAvatar = 'https://cdn4.iconfinder.com/data/icons/men-avatars-icons-set-2/256/4-512.png';

const ProfileScreen: React.FC = () => (
  <ScrollView>
    <Image
      source={{ uri: mockAvatar }}
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