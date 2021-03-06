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
import { editProfile, fetchProfile, updateProfileAvatar } from '@store/users/users.actions';
import { FileBase64 } from '@models/file-base64';
import { CachedImageLoaded } from '@components/atoms/CachedImageLoaded/cached-image-loaded.component';
import FastImage from 'react-native-fast-image';

interface EditProfileProps {
  profile: User;
  editProfile: (changes: Partial<User>) => Promise<User>;
  updateAvatar: (file: FileBase64) => Promise<string>;
  fetchProfile: () => Promise<User>;
}

interface EditProfileState {
  avatarPreview?: string;
  avatar?: string;
  username: string;
  bio?: string;
  nickname: string;
  loading: boolean;
}

class EditProfileScreen extends React.Component<EditProfileProps, EditProfileState> {
  newAvatar?: FileBase64;

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
      const promise = this.props.updateAvatar(this.newAvatar)
        .then(s3Key => this.setState({ avatar: s3Key }));

      promises.push(promise)
    }
    
    promises.push(
      this.props.editProfile({ nickname, bio })
    );

    await Promise.all(promises);
    
    this.setState({
      avatarPreview: undefined,
      loading: false,
    });
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

      this.setState({ avatarPreview: uri });
    });
  }

  render() {
    const { username, avatar, nickname, bio, loading, avatarPreview } = this.state;

    return (
      <ScrollView 
        style={styles.editPorfileWrapper}
        keyboardShouldPersistTaps='handled'
      >
        <View>
          <TouchableNativeFeedback
            onPress={() => this.onChangeAvatar()}
            background={TouchableNativeFeedback.Ripple(Colors.light, true)}
          >
            <View style={styles.avatarWrapper}>
              { avatarPreview ? (
                  <FastImage
                    style={styles.avatar}
                    source={{uri: avatarPreview}}
                  />
                ) : (
                  <CachedImageLoaded
                    style={styles.avatar}
                    s3Key={avatar}
                    defaultImage={defaultAvatar}
                  />
                )
              }
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
  updateAvatar: (file: FileBase64) => dispatch(updateProfileAvatar(file)),
  fetchProfile: () => dispatch(fetchProfile())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileScreen);