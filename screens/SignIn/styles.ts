import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default StyleSheet.create({
  scrollView: {
    padding: 20,
    backgroundColor: Colors.dark,
    // alignItems: center
  },
  linkButton: {
    color: Colors.primary,
    marginTop: 26,
    fontSize: 13,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  authForm: {
    marginBottom: 26
  }
});