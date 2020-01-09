import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { TextInput, Avatar } from 'react-native-paper';
import styles from './styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { connect } from 'react-redux';
import { AppState } from '@store/index';
import { User } from '@models/user';

interface EditProfileProps {
  profile: User
}

class EditProfileScreen extends React.Component<EditProfileProps> {

  render() {
    const { username, nickname, bio, avatar } = this.props.profile;

    return (
      <ScrollView style={styles.editPorfileWrapper}>
        <View>
          <Avatar.Image
            size={148}
            source={{ uri: avatar }}
            style={styles.avatar}
          />

          <BasicTextField 
            label='Username'
            value={username}
          />

          <BasicTextField
            label='Nickname'
            value={nickname}
          />
        </View>

        <TextInput
          label='Bio'
          // mode='outlined'
          multiline={true}
          numberOfLines={4}
          underlineColor={Colors.primary}
          selectionColor={Colors.primary}
          value={bio}
        />

      </ScrollView>
    )
  }
}

const mapStateToProps = (store: AppState) => ({
  profile: store.usersModule.profile!
});

export default connect(
  mapStateToProps
)(EditProfileScreen);