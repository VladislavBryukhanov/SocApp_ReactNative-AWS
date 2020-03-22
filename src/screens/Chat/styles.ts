import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;

const dateTimeWidth = 70;
const avatarWidth = 50;
const elementsMargin = 10;

const maxMessageWidth = screenWidth - (avatarWidth + elementsMargin * 2) - (dateTimeWidth + elementsMargin * 2);

const border = {
  borderColor: '#1A567B',
  borderWidth: 1,
};

export default StyleSheet.create({
  chat: {
    display: 'flex',
    flex: 1
  },
  messageList: {
    display: 'flex',
    flex: 1,
  },
  srollBottomFab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    margin: 16,
    marginBottom: 64,
    backgroundColor: Colors.primary,
  },
  messageView: {
    flex: 1,
    flexDirection:'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginVertical: elementsMargin
  },
  reversed: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    marginLeft: 'auto',
  },
  sender: {
    marginHorizontal: elementsMargin
  },
  avatar: {
    ...border,
    height: 50,
    width: avatarWidth,
    borderRadius: 10,
    elevation: 4,
  },
  message: {
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  incomingMessage: {
    backgroundColor: '#243443'
  },
  outcomingMessage: {
    backgroundColor: '#1A567B',
  },
  content: {
    color: 'white',
    maxWidth: maxMessageWidth,
  },
  dateTimeView: {
    alignItems: 'center',
    width: dateTimeWidth,
  },
  dateTime: {
    color: 'grey',
    fontSize: 12,
    marginHorizontal: elementsMargin
  }
})
