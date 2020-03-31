import React from 'react';
import { FlatList, Text, View, TouchableNativeFeedback } from 'react-native';
import { NavigationSwitchScreenProps } from 'react-navigation';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { User } from '@models/user';
import { AppState } from '@store/index';
import { fetchUsers } from '@store/users/users.actions';
import defaultAvatar from '@assets/icons/user.png';
import AppMenu from '@components/Menu/menu.component';
import { Preloader } from '@components/atoms/Prloader/preloader.component';
import { CachedImageLoaded } from '@components/atoms/CachedImageLoaded/cached-image-loaded.component';
import styles from './styles';

interface UserListProps extends NavigationSwitchScreenProps {
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
    headerRight: () => <AppMenu/>,
  };

  onOpenProfile = (user: User) => {
    this.props.navigation.navigate(
      'Profile',
      { user }
    );
  }

  userTemplate = ({ item }: { item: User }) => (
    <TouchableNativeFeedback
      key={item.id!}
      onPress={() => this.onOpenProfile(item)}
    >
      <View style={styles.userContainer}>
        <CachedImageLoaded
          imageUrl={item.avatar}
          style={styles.avatar}
          defaultImage={defaultAvatar}
        />
        <View>
          <Text style={styles.nickname}>{item.nickname}</Text>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  )

  render() {
    return this.props.userList.length ? (
      <FlatList
        extraData={this.state}
        data={this.props.userList}
        renderItem={this.userTemplate}
      />
    ) : <Preloader/>;
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
