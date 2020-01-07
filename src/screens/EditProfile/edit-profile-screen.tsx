import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { BasicTextField } from '@components/atoms/BasicTextField/basic-text-field.component';

// import React from 'react';
class EditProfileScreen extends React.Component {
  render() {
    return (
      <ScrollView>
        <View>
        </View>

        <BasicTextField 
          label='username'
          value='Test'
        />

        <BasicTextField
          label='nickname'
          value='Test'
        />

        <BasicTextField
          label='bio'
          value='Test'
        />

      </ScrollView>
    )
  }
}

export default EditProfileScreen;