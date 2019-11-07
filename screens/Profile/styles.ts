import { StyleSheet, Dimensions, TextStyle } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';
const win = Dimensions.get('window');

const profileField: TextStyle = {
  textAlign: 'center',
  textTransform: 'capitalize'
}

export default StyleSheet.create({
  avatarWrapper: {
    width: 'auto',
    height: win.height / 3,
  },
  avatar: {
    flex: 1,
    // width: 'auto',
    // height: win.height / 3, // 33%
    resizeMode: 'contain',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.dark,
  },
  nickname: {
    fontSize: 22,
    fontWeight: 'bold',
    ...profileField
  },
  username: {
    fontSize: 20,
    ...profileField
  }
})