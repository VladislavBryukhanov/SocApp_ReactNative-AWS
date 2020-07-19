import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  editPorfileWrapper: {
    padding: 20
  },
  saveButton: {
    marginBottom: 42,
    marginTop: 20,
  },
  textInput: {
    height: 48,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 16,
    color: Colors.dark,
  },
  avatarWrapper: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  avatar: {
    borderColor: '#1A567B',
    borderWidth: 2,
    borderRadius: 90,
    width: 148,
    height: 148
  }
});