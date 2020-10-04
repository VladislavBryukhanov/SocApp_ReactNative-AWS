import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NavigationScreenProp, NavigationSwitchScreenProps, withNavigation } from 'react-navigation';
import defaultAvatar from '@assets/icons/user.png';
import { startCase } from 'lodash';
import styles from './styles';
import { CachedImageLoaded } from '@components/atoms/CachedImageLoaded/cached-image-loaded.component';
import { FAB } from 'react-native-paper';
import { AppState } from '@store/index';
import { Dispatch, compose } from 'redux';
import { findDirectByInterlocutor } from '@store/chat-rooms/chat-rooms.actions';
import { connect } from 'react-redux';
import { ChatRoom } from '@models/chat-room';

interface ProfileScreeProps extends NavigationSwitchScreenProps {
  lastFoundDirect: ChatRoom;
  findDirectByInterlocutor: (interlocutorId: string) => Promise<void>;
}

interface ProfieScreenState {
  chatOpening: boolean;
}

type NavigationProps = NavigationScreenProp<{ screenName: string }>;

class ProfileScreen extends React.Component<ProfileScreeProps, ProfieScreenState> {
  state = { chatOpening: false }

  static navigationOptions = ({ navigation }: { navigation: NavigationProps }) => {
    const user = navigation.getParam('user');
    const title = startCase(user.nickname);

    return { title };
  };

  onOpenChat = async () => {
    this.setState({ chatOpening: true });

    const interlocutor = this.props.navigation.getParam('user');
    await this.props.findDirectByInterlocutor(interlocutor.id);

    this.props.navigation.navigate('Chat', { 
      interlocutor,
      chatId: this.props.lastFoundDirect && this.props.lastFoundDirect.id
    });

    this.setState({ chatOpening: false });
  };

  render() {
    const user = this.props.navigation.getParam('user');
    const { avatar, bio, age, username, nickname } = user;

    return (
      <ScrollView contentContainerStyle={styles.profileView}>
        <CachedImageLoaded
          imageUrl={avatar}
          style={styles.avatar}
          defaultImage={defaultAvatar}
        />

        <View style={styles.infoView}>
          <Text style={styles.nickname}>Nickname:</Text>
          <Text style={styles.nickname}>{nickname}</Text>
        </View>

        <View style={styles.infoView}>
          <Text style={styles.username}>Username:</Text>
          <Text style={styles.username}>@{username}</Text>
        </View>

        <View style={styles.infoView}>
          <Text>
            Age: {age} *TODO
          </Text>
        </View>

        <Text style={styles.infoView}>
          Bio: {bio} *TODO
        </Text>

        <FAB
          style={styles.chatBtn}
          icon="message-text"
          onPress={this.onOpenChat}
          disabled={this.state.chatOpening}
        />
      </ScrollView>
    )
  }
}

const mapStateToProps = (store: AppState) => ({
  lastFoundDirect: store.chatRoomsModule.lastFoundDirect
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  findDirectByInterlocutor: (interlocutorId: string) => dispatch(findDirectByInterlocutor(interlocutorId))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withNavigation
)(ProfileScreen);
