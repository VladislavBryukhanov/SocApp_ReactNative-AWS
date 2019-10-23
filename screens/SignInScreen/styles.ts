import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default StyleSheet.create({
  scrollView: {
    padding: 20,
    backgroundColor: Colors.dark,
    // alignItems: center
  },
  textInput: {
    borderColor: Colors.primary,
    borderWidth: 1,
    flex: 1,
    marginTop: 10,
    marginBottom: 16
  },
  label: {
    color: Colors.primary,
    fontSize: 17,
  },
  authForm: {
    marginBottom: 22
  }
});