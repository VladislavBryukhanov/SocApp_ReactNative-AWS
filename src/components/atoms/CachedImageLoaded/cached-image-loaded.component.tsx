import React, { useCallback, useEffect, useState } from 'react';
import { View, ImageStyle, StyleProp } from 'react-native';
import FastImage, { FastImageSource } from 'react-native-fast-image';
import AsyncStorage from '@react-native-community/async-storage';
import s3 from '@api/s3/native-s3';
import preloader2 from '@assets/preloaders/preloader2.gif';

interface CachedImageLoadedProps {
  s3Key?: string;
  imageUrl?: string;
  defaultImage: FastImageSource;
  style: StyleProp<ImageStyle>;
}

export const CachedImageLoaded: React.FC<CachedImageLoadedProps> = (props: CachedImageLoadedProps) => {
  const { imageUrl, style, defaultImage, s3Key } = props;
  const [ loadingStatus, setLoadingStatus ] = useState(!!s3Key || !!imageUrl);
  const [ source, setSource ] = useState(
    imageUrl 
      ? { uri: imageUrl } 
      : defaultImage
  );

  const getTargetUrl = useCallback(async () => {
    if (!s3Key) return;

    const cachedUrl = await AsyncStorage.getItem(s3Key);
    
    if (cachedUrl) {
      return setSource({ uri: cachedUrl });
    }

    const image = await s3.read(s3Key);
    // TODO catch errors
    AsyncStorage.setItem(s3Key, image);
    setSource({ uri: image });
  }, [s3Key]);

  useEffect(() => {
    getTargetUrl();
  }, [getTargetUrl])

  return (
    <View>
      { loadingStatus && (
        <FastImage 
          source={preloader2}
          style={[ style, { position: 'absolute' } ]}
        />
      )}
      <FastImage 
        source={source}
        style={style}
        onLoadEnd={() => setLoadingStatus(false)}
      />
    </View>
  );
}