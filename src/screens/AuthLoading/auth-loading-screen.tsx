import React from 'react';
import { View } from 'react-native';
import { NavigationSwitchScreenProps } from 'react-navigation';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { retrieveAuthenticatedUser } from '@store/auth/auth.actions';
import styles from './styles';
import { Preloader } from '@components/atoms/Prloader/preloader.component';
import { AppState } from '@store/index';

interface AuthLoadingScreenProps extends NavigationSwitchScreenProps {
  retrieveAuthenticatedUser: () => any
  isAuthenticated?: boolean;
}

class AuthLoadingScreen extends React.Component<AuthLoadingScreenProps> {
  async componentDidMount() {
    await this.props.retrieveAuthenticatedUser();

    if (this.props.isAuthenticated) {
      return this.props.navigation.navigate('App');
    }
    this.props.navigation.navigate('Auth');
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
  retrieveAuthenticatedUser: () => dispatch(retrieveAuthenticatedUser())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthLoadingScreen);