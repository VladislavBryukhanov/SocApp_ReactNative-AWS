import { DefaultTheme } from 'react-native-paper';

export const customColors = {
  primary: '#1A567B',
  secondary: '#243443',
  darkText: '#2B3856',
}

export const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    accent: customColors.primary,
  },
};

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