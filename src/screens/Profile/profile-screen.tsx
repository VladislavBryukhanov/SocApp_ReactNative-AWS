import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { NavigationScreenProp, NavigationSwitchScreenProps } from 'react-navigation';
import defaultAvatar from '@assets/icons/user.png';
import { startCase } from 'lodash';
import styles from './styles';
import { CachedImageLoaded } from '@components/atoms/CachedImageLoaded/cached-image-loaded.component';
import { Button, FAB } from 'react-native-paper';
import { Colors } from 'react-native/Libraries/NewAppScreen';

interface ProfileScreeProps extends NavigationSwitchScreenProps {}

type NavigationProps = NavigationScreenProp<ScreenParams>;
type ScreenParams = {
  screenName: string;
}

class ProfileScreen extends React.Component<ProfileScreeProps> {
  componentDidMount() {
    const user = this.props.navigation.getParam('user');
    const screenName = startCase(user.nickname);

    this.props.navigation.setParams({ screenName });
  }

  static navigationOptions = ({ navigation }: { navigation: NavigationProps }) => ({
    title: navigation.getParam('screenName')
  });

  onOpenChat = () => {
    this.props.navigation.navigate('Chat');
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
        />
      </ScrollView>
    )
  }
}

export default ProfileScreen;