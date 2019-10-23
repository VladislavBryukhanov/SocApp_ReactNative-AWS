import React from 'react';
import { FlatList, Text, View, Image, TouchableNativeFeedback } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import styles from './styles';
import { NavigationParams } from 'react-navigation';

interface UserListProps extends NavigationParams {}

type User = {
  id: string;
  name: string;
  avatar: string;
};

const mockAvatar = 'https://cdn4.iconfinder.com/data/icons/men-avatars-icons-set-2/256/4-512.png';
// const mockAvatar = 'https://facebook.github.io/react/logo-og.png';

const mockData: User[] = [
  { id: 'q1', name: '123', avatar: mockAvatar },
  { id: 'q2', name: '123', avatar: mockAvatar },
  { id: 'q3', name: '123', avatar: mockAvatar },
  { id: 'q4', name: '123', avatar: mockAvatar },
  { id: 'q5', name: '123', avatar: mockAvatar },
  { id: 'q6', name: '123', avatar: mockAvatar },
  { id: 'q7', name: '123', avatar: mockAvatar },
  { id: 'q8', name: '123', avatar: mockAvatar },
  { id: 'q9', name: '123', avatar: mockAvatar },
  { id: 'q10', name: '123', avatar: mockAvatar },
];

const UserListScreen: React.FC<UserListProps> = (props: UserListProps) => {
  const onOpenProfile = () => {
    props.navigation.navigate('Profile');
  }

  const userTemplate = ({ item }: { item: User }) => {
    return (
      <TouchableNativeFeedback
        key={item.id}
        onPress={onOpenProfile}
      >
        <View style={styles.userContainer}>
          <Image 
            source={{ uri: item.avatar }}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.name}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  return (
    <FlatList
      data={mockData}
      renderItem={userTemplate}
    />
  )
}
export default UserListScreen;
