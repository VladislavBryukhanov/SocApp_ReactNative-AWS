import React from 'react';
import { NavigationParams, withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';
import { signOut } from '@store/auth/auth.actions';
import styles from './styles';

interface SignOutProps extends NavigationParams {
  signOut: () => void
};

const SignOutButton: React.FC<SignOutProps> = (props: SignOutProps) => {
  const signOut = () => {
    props.signOut();
    props.navigation.navigate('Auth');
  };

  return (
    <Icon
      name="exit-to-app"
      style={styles.menuButton}
      onPress={signOut}
    /> 
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signOut: () => dispatch(signOut())
})

export default compose(
  connect(null,  mapDispatchToProps),
  withNavigation
)(SignOutButton);