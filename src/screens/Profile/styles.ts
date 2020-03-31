import { StyleSheet, Dimensions, TextStyle } from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';
const win = Dimensions.get('window');

const profileField: TextStyle = {
  textAlign: 'center',
  textTransform: 'capitalize'
}

export default StyleSheet.create({
  profileView: {
    flex: 1,
  },
  avatar: {
    width: 'auto',
    height: win.height / 3,
    borderWidth: 1,
    borderColor: Colors.dark,
  },
  infoView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  nickname: {
    marginTop: 24,
    fontSize: 22,
    fontWeight: 'bold',
    ...profileField
  },
  username: {
    fontSize: 20,
    marginBottom: 18,
    ...profileField
  }, 
  chatBtn: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  }
})