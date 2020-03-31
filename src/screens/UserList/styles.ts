import { customColors } from '@constants/theme';
import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default StyleSheet.create({
  userContainer: {
    flexDirection:'row',
    flexWrap:'wrap',
    flex: 1, 
    alignItems: 'center',

    padding: 10,
    borderBottomColor: Colors.light,
    borderBottomWidth: 1,
  },
  avatar: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: Colors.dark,
    marginRight: 12
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: customColors.darkText
  },
  username: {
    fontSize: 15,
    color: customColors.darkText
  },
})