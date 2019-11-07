import React from 'react';
import { ScrollView, Image, Text, View } from 'react-native';
import { NavigationParams } from 'react-navigation';
import defaultAvatar from '../../assets/icons/user.png';
import styles from './styles';

interface ProfileScreeProps extends NavigationParams {}

const ProfileScreen: React.FC<ProfileScreeProps> = (props: ProfileScreeProps) => {
  const user = props.navigation.getParam('user');
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

export default ProfileScreen;