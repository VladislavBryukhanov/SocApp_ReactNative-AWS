import React, { useState } from 'react';
import { Button, Paragraph, Menu, Divider, Provider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Fontisto';
import { View } from 'react-native';
import styles from './styles';
import { NavigationSwitchScreenProps, withNavigation } from 'react-navigation';
import { signOut } from '@store/auth/auth.actions';
import { connect } from 'react-redux';
import { Dispatch, compose } from 'redux';

interface AppMenuProps extends NavigationSwitchScreenProps {
  signOut: () => void
};

const AppMenu: React.FC<AppMenuProps> = (props: AppMenuProps) => {
  const [isVisible, setVisibility] = useState(false);

  const onSignOut = () => {
    props.signOut();
    props.navigation.navigate('Auth');
    setVisibility(false);
  };
  const onGoToEditProfile = () => {
    props.navigation.navigate('EditProfile');
    setVisibility(false);
  };

  return (
    <Menu
      visible={isVisible}
      onDismiss={() => setVisibility(false)}
      anchor={
        <Icon
          name="more-v-a"
          style={styles.menuButton}
          onPress={() => setVisibility(true)}
        /> 
      }
    >
      <Menu.Item 
        onPress={onGoToEditProfile}
        icon='settings'
        title="Configure profile"
      />
      <Menu.Item
        onPress={onSignOut}
        icon='exit-to-app'
        title="Sign out"
      />
    </Menu>
  );
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  signOut: () => dispatch(signOut())
})

export default compose<AppMenuProps>(
  connect(null,  mapDispatchToProps),
  withNavigation
)(AppMenu);