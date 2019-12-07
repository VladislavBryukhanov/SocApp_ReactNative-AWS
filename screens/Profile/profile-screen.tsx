import React from 'react';
import { ScrollView, Image, Text, View } from 'react-native';
import { NavigationParams, NavigationScreenProp } from 'react-navigation';
import defaultAvatar from '../../assets/icons/user.png';
import styles from './styles';
import { startCase } from 'lodash';

interface ProfileScreeProps extends NavigationParams {}
interface ScreenParams {
  screenName: string;
}

class ProfileScreen extends React.Component<ProfileScreeProps> {
  componentDidMount() {
    const user = this.props.navigation.getParam('user');
    const screenName = startCase(user.nickname);

    this.props.navigation.setParams({ screenName });
  }

  static navigationOptions = ({ navigation }: { navigation: NavigationScreenProp<ScreenParams> }) => ({
    title: navigation.getParam('screenName')
  });

  render() {
    const user = this.props.navigation.getParam('user');
    const { avatar, bio, age, username, nickname } = user;

    const userAvatar = avatar
      ? { uri: user.avatar }
      : defaultAvatar;

    return (
      <ScrollView>
        <View style={styles.avatarWrapper}>
          <Image style={styles.avatar} source={userAvatar}/>
        </View>

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
      </ScrollView>
    )
  }
}

export default ProfileScreen;