import { Colors } from 'react-native/Libraries/NewAppScreen';
import { StyleSheet } from "react-native";

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
    ...border,
    backgroundColor: Colors.primary,
  },
  message: {
    flexDirection:'row',
    flexWrap:'wrap',
    flex: 1, 
    alignItems: 'center',
    alignSelf: 'flex-start',

    backgroundColor: Colors.primary,

    padding: 10,
    margin: 10,
    borderRadius: 8,
    ...border,

    elevation: 4,
  },
  content: {
    color: 'white',
  }
})

// <color name="colorPrimary">#282828</color>
// <color name="colorPrimaryDark">#161616</color>
// <color name="colorAccent">#6B9BC2</color>
// <color name="whiteShadow">#f1f1f1</color>

// <color name="solid_dark">#282828</color>
// <color name="solid_black">#161616</color>
// <color name="black_overlay">#66000000</color>
// <color name="dialogBack">#c8000000</color>

// <color name="borderColor">#C8464646</color>
// <color name="onlineColor">#558DC4</color>
// <color name="offlineColor">#ffffff</color>
// <color name="afkColor">#FFF171</color>

// <color name="incomingMessage">#243443</color>
// <color name="outcomeMessage">#1A567B</color>
// <color name="unreadMessage">#FFC4C4C4</color>
// <color name="lightBlue">#6B9BC2</color>

// <color name="darkRed">#a43931</color>
// <color name="lightIonic">#14aba8</color>
// <color name="lincIonicColor">#00aca2</color>
// <color name="darkIonic">#00726a</color>