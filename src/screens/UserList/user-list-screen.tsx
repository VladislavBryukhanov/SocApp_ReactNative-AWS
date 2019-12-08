import React from 'react';
import { FlatList, Text, View, Image, TouchableNativeFeedback } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { User } from '@models/user';
import { AppState } from '@store/index';
import { fetchUsers } from '@store/users/users.actions';
import defaultAvatar from '@assets/icons/user.png';
import SignOutButton from '@components/SignOutButton/sign-out-button.component';
import styles from './styles';

interface UserListProps extends NavigationParams {
  userList: User[];
  fetchUsers: () => Promise<void>;
}

class UserListScreen extends React.Component<UserListProps> {
  componentDidMount() {
    if (!this.props.userList.length) {
      this.props.fetchUsers();
    }
  }

  static navigationOptions = {
    headerRight: () => <SignOutButton/>,
  };

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
