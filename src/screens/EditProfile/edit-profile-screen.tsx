import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { TouchableNativeFeedback } from 'react-native';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';
import { TextInput, Avatar, Button } from 'react-native-paper';
import styles from './styles';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ImagePicker from 'react-native-image-picker';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '@store/index';
import { User } from '@models/user';
import defaultAvatar from '@assets/icons/user.png';
import { editProfile, fetchProfile } from '@store/users/users.actions';
import s3 from '@api/s3/native-s3';
import usersRepository from '@api/repositories/users.repository';

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

interface AvatarPayload {
  data: string;
  type: string;
  extension: string;
}

class EditProfileScreen extends React.Component<EditProfileProps, EditProfileState> {
  newAvatar?: AvatarPayload;

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
    const promises: Promise<User | void>[] = [];
  
    this.setState({ loading: true });
    
    if (this.newAvatar) {
      const { data, type, extension } = this.newAvatar;

      const promise = usersRepository.uploadProfileAvatar(data, type!, extension)
        .then(({ s3Key }) => s3.read(s3Key))
        .then(url => this.setState({ avatar: url }));

      promises.push(promise)
    }
    
    promises.push(
      this.props.editProfile({ nickname, bio })
    );

    await Promise.all(promises);
    
    this.setState({ loading: false });
  }

  onChangeAvatar = () => {
    const options = {
      tintColor: Colors.primary,
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, async ({ data, type, fileName, uri }) => {
      const extension = fileName!.split('.')[1];
      this.newAvatar = { data, type: type!, extension };

      this.setState({ avatar: uri });
    });
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
          <TouchableNativeFeedback
            onPress={() => this.onChangeAvatar()}
            background={TouchableNativeFeedback.Ripple('#AAF', true)}
          >
            <View style={styles.avatarWrapper}>
              <Avatar.Image
                size={148}
                source={userAvatar}
              />
            </View>
          </TouchableNativeFeedback>

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