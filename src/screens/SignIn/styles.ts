import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default StyleSheet.create({
  scrollView: {
    padding: 20,
    backgroundColor: Colors.dark,
    // alignItems: center
  },
  authForm: {
    marginBottom: 26
  },
  signUpWrapper: {
    flexDirection: "row",
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: Colors.white,
    marginRight: 10
  }
});