import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { customColors } from '@constants/theme';

export default StyleSheet.create({
  title: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: 22,
    marginBottom: 20
  },
  description: {
    textAlign: 'center',
    color: Colors.light,
    fontSize: 16,
    marginBottom: 20
  },
  confirmButton: {
    marginTop: 8,
    borderColor: customColors.primary,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  }
});