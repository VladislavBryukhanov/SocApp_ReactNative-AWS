import React from 'react';
import { FlatList, Text, View, Image, TouchableNativeFeedback } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { AppState } from 'store';
import { Dispatch } from 'redux';
import { fetchUsers } from '../../store/users/users.actions';
import { User } from '../../types/user';
import styles from './styles';
import defaultAvatar from '../../assets/icons/user.png';

interface UserListProps extends NavigationParams {
  userList: User[];
  fetchUsers: () => Promise<void>;
}

class UserListScreen extends React.Component<UserListProps> {
  componentDidMount() {
    this.props.fetchUsers();
  }

  onOpenProfile = (user: User) => {
    this.props.navigation.navigate(
      'Profile',
      { user }
    );
  }

  userTemplate = ({ item }: { item: User }) => {
    const avatar = item.avatar
      ? { uri: item.avatar } 
      : defaultAvatar;

    return (
      <TouchableNativeFeedback
        key={item.id!}
        onPress={() => this.onOpenProfile(item)}
      >
        <View style={styles.userContainer}>
          <Image 
            source={avatar}
            style={styles.avatar}
          />
          <Text style={styles.username}>{item.username}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    return (
      <FlatList
        data={this.props.userList}
        renderItem={this.userTemplate}
      />
    )
  }
}

const mapStateToProps = (store: AppState) => ({
  userList: store.usersModule.users
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchUsers: () => dispatch(fetchUsers())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserListScreen);
