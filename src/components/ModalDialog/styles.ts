import { StyleSheet } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create({
  modal: {
    padding: 20,
    backgroundColor: Colors.dark,
    flex: 1,
  },
  closeButton: {
    fontSize: 26,
    marginLeft: 'auto',
    color: Colors.light,
  }
})