import React from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationParams } from 'react-navigation';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { retrieveAuthenticatedUser } from '@store/auth/auth.actions';
import styles from './styles';

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
      <View style={styles.container}>
        <StatusBar barStyle="default" />
        <ActivityIndicator size={80} color={Colors.primary}/>
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