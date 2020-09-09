import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  preloader: {
    height: 35,
    width: 35,
    margin: 6,
  },
  chatInput: {
    flexDirection:'row',
    flexWrap:'wrap',

    borderColor: '#f0f0f0',
    borderWidth: 1,

    elevation: 26,
    backgroundColor: '#ffffff'
  },
  messageInput: {
    flex: 1,
    paddingLeft: 12,
  }
})