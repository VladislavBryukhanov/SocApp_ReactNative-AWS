import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { TextInput, Avatar, Button } from 'react-native-paper';
import styles from './styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '@store/index';
import { User } from '@models/user';
import defaultAvatar from '@assets/icons/user.png';
import { editProfile, fetchProfile } from '@store/users/users.actions';

interface EditProfileProps {
  profile: User;
  editProfile: (changes: Partial<User>) => Promise<User>;
  fetchProfile: () => Promise<User>
}

interface EditProfileState {
  avatar?: string;
  username: string;
  bio?: string;
  nickname: string;
  loading: boolean;
}

class EditProfileScreen extends React.Component<EditProfileProps, EditProfileState> {
  constructor(props: EditProfileProps) {
    super(props);

    const { username, avatar, bio, nickname } = this.props.profile;
    this.state = {
      avatar,
      bio,
      nickname,
      username,
      loading: false
    };
  }

  onEdit = async () => {
    const { nickname, bio } = this.state;
  
    this.setState({ loading: true });
    
    await this.props.editProfile({ nickname, bio });

    this.setState({ loading: false });
  }

  render() {
    const { username, avatar , nickname, bio, loading } = this.state;
    const userAvatar = avatar
      ? { uri: avatar }
      : defaultAvatar;

    return (
      <ScrollView 
        style={styles.editPorfileWrapper}
        keyboardShouldPersistTaps='handled'
      >
        <View>
          <Avatar.Image
            size={148}
            source={userAvatar}
          />

          <BasicTextField 
            label='Username'
            value={username}
            editable={false}
          />

          <BasicTextField
            style={styles.textInput}
            label='Nickname'
            value={nickname}
            onChangeText={(value: string) => this.setState({ nickname: value })}
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
          onChangeText={(value: string) => this.setState({ bio: value })}
          />

        <Button
          mode="outlined"
          loading={loading}
          disabled={loading}
          style={styles.saveButton}
          color={Colors.primary}
          onPress={this.onEdit}
        >
          Save
        </Button>
      </ScrollView>
    )
  }
}

const mapStateToProps = (store: AppState) => ({
  profile: store.usersModule.profile!
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  editProfile: (changes: Partial<User>) => dispatch(editProfile(changes)),
  fetchProfile: () => dispatch(fetchProfile())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileScreen);