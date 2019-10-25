import React from 'react';
import { FlatList, Text, View, Image, TouchableNativeFeedback } from 'react-native';
import { NavigationParams } from 'react-navigation';
import styles from './styles';
import { User } from 'types/user';

interface UserListProps extends NavigationParams {}

const mockAvatar = 'https://cdn4.iconfinder.com/data/icons/men-avatars-icons-set-2/256/4-512.png';
// const mockAvatar = 'https://facebook.github.io/react/logo-og.png';

const mockData: User[] = [
  { id: 'q1', username: '123', avatar: mockAvatar },
  { id: 'q2', username: '123', avatar: mockAvatar },
  { id: 'q3', username: '123', avatar: mockAvatar },
  { id: 'q4', username: '123', avatar: mockAvatar },
  { id: 'q5', username: '123', avatar: mockAvatar },
  { id: 'q6', username: '123', avatar: mockAvatar },
  { id: 'q7', username: '123', avatar: mockAvatar },
  { id: 'q8', username: '123', avatar: mockAvatar },
  { id: 'q9', username: '123', avatar: mockAvatar },
  { id: 'q10', username: '123', avatar: mockAvatar },
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
          <Text style={styles.username}>{item.username}</Text>
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
