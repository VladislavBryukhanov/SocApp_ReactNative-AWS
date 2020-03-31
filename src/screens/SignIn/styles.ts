import { customColors } from '@constants/theme';
import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default StyleSheet.create({
  scrollView: {
    padding: 20,
    backgroundColor: Colors.dark,
  },
  authForm: {
    marginBottom: 26
  },
  signInBtn: {
    borderColor: customColors.primary,
    backgroundColor: 'rgba(255, 255, 255, 08)'
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