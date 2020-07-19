import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { customColors } from "@constants/theme";

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
    marginBottom: 16,
    color: Colors.light
  },
  label: {
    color: Colors.primary,
    fontSize: 17,
  },
  authForm: {
    marginBottom: 22
  },
  signUpBtn: {
    marginBottom: 42,
    borderColor: customColors.primary,
    backgroundColor: 'rgba(255, 255, 255, 08)'
  }
});