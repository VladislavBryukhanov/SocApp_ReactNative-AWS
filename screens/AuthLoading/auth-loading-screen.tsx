import React, { useEffect } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { Dispatch } from 'redux';
import { retrieveAuthenticatedUser } from '../../store/auth/auth.actions';
import { connect } from 'react-redux';
import { NavigationParams } from 'react-navigation';

interface AuthLoadingScreenProps extends NavigationParams {
  retrieveAuthenticatedUser: () => any
}

class AuthLoadingScreen extends React.Component<AuthLoadingScreenProps> {
  async componentDidMount() {
    const user = await this.props.retrieveAuthenticatedUser();
    if (user) {
      return this.props.navigation.navigate('App');
    }
    this.props.navigation.navigate('Auth');
  }

  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  retrieveAuthenticatedUser: () => dispatch(retrieveAuthenticatedUser())
});

export default connect(
  null,
  mapDispatchToProps
)(AuthLoadingScreen);