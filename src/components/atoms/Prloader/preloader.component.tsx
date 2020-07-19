import React from 'react';
import { Image, View } from "react-native";
// import preloader from '@assets/preloaders/preloader.gif';
import preloader2 from '@assets/preloaders/preloader2.gif';
import styles from './styles';

export const Preloader: React.FC = () => {
  // const randomImage = [
  //   preloader,
  //   preloader2
  // ][Math.floor(Math.random() * 2)];

  return (
    <View style={styles.preloader}>
      <Image source={preloader2} style={styles.image}/>
    </View>
  )
}