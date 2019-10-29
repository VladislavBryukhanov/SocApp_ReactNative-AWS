import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default StyleSheet.create({
  textInput: {
    height: 48,
    borderColor: Colors.primary,
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 16,
    color: Colors.light
  },
  label: {
    color: Colors.primary,
    fontSize: 16,
  }
});