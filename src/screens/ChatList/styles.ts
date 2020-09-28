import { customColors } from "@constants/theme";
import { StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

export default StyleSheet.create({
  roomContainer: {
    flexDirection:'row',
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: customColors.secondary
  },
  lastMsgContent: {
    fontSize: 15,
    color: customColors.primary,
  },
  createDate: {
    fontSize: 13,
    color: Colors.dark,
    marginRight: 4,
    alignSelf: "center"
  },
  headLine: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',
  },
  textData: {
    flex: 1,
    paddingVertical: 2
  }
});
