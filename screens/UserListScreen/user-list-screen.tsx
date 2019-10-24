import React from 'react';
import { FlatList, Text, View, Image, TouchableNativeFeedback } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { NavigationParams } from 'react-navigation';
import API from '@aws-amplify/api'
import awsConfig from '../../aws-exports';
import styles from './styles';
import apiParams from '../../amplify/backend/api/socAppApi/api-params.json';
// import apiParams from '../../amplify/backend/api/api02d0d043/api-params';

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

class UserListScreen extends React.Component<UserListProps> {
  componentDidMount() {
    API.configure(awsConfig);
    const init = { // OPTIONAL
      // headers: {}, // OPTIONAL
      response: true, // OPTIONAL (return the entire Axios response object instead of only response.data)
      // queryStringParameters: {  // OPTIONAL
      //     name: 'param'
      // },
      body: {
        id: 'test',
        username: 'TEST1234'
      }
    };
    API.post(apiParams.apiName, apiParams.paths[0].name, init)
  }

  onOpenProfile = () => {
    this.props.navigation.navigate('Profile');
  }

  userTemplate = ({ item }: { item: User }) => {
    return (
      <TouchableNativeFeedback
        key={item.id}
        onPress={this.onOpenProfile}
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

  render() { 
    return (
      <FlatList
        data={mockData}
        renderItem={this.userTemplate}
      />
    )
  }
}
export default UserListScreen;
