import React from 'react';
import { View } from 'react-native';
import { NavigationSwitchScreenProps } from 'react-navigation';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '@store/index';
import { retrieveAuthenticatedUser } from '@store/auth/auth.actions';
import { updateNotificationToken } from '@store/users/users.actions';
import { Preloader } from '@components/atoms/Prloader/preloader.component';
import styles from './styles';

import PushNotification from 'react-native-push-notification';
import { FCM_SENDER_ID } from 'react-native-dotenv';

interface AuthLoadingScreenProps extends NavigationSwitchScreenProps {
  retrieveAuthenticatedUser: () => Promise<void>;
  updateNotificationToken: (toke: string) => Promise<void>;
  isAuthenticated?: boolean;
}

class AuthLoadingScreen extends React.Component<AuthLoadingScreenProps> {
  async componentDidMount() {
    await this.props.retrieveAuthenticatedUser();

    if (!this.props.isAuthenticated) {
      return this.props.navigation.navigate('Auth');
    }

    this.props.navigation.navigate('App');
    this.registerPushNotifications();
  }

  registerPushNotifications() {
    PushNotification.configure({
      onRegister: async ({ token }) => {
        await this.props.updateNotificationToken(token);
      },

      senderID: FCM_SENDER_ID,
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Preloader/>
      </View>
    );
  }
}

const mapStateToProps = (store: AppState) => ({
  isAuthenticated: store.authModule.isAuthenticated
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  retrieveAuthenticatedUser: () => dispatch(retrieveAuthenticatedUser()),
  updateNotificationToken: (token: string) => dispatch(updateNotificationToken(token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);