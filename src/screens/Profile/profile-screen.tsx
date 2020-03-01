import React from 'react';
import { ScrollView, Text } from 'react-native';
import { NavigationScreenProp, NavigationSwitchScreenProps } from 'react-navigation';
import defaultAvatar from '@assets/icons/user.png';
import { startCase } from 'lodash';
import styles from './styles';
import { CachedImageLoaded } from '@components/atoms/CachedImageLoaded/cached-image-loaded.component';
import { Button } from 'react-native-paper';
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
      <ScrollView>
        <CachedImageLoaded
          imageUrl={avatar}
          style={styles.avatar}
          defaultImage={defaultAvatar}
        />

        <Text style={styles.nickname}>
          Nickname: {nickname}
        </Text>
        <Text  style={styles.username}>
        Username: @{username}
        </Text>
        <Text>
          Age: {age}
        </Text>
        <Text>
          Bio: {bio}
        </Text>
        <Button
          mode="outlined"
          color={Colors.primary}
          onPress={this.onOpenChat}
        >
          Send Mesasge
        </Button>
      </ScrollView>
    )
  }
}

export default ProfileScreen;