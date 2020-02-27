import React, { useState } from 'react';
import { View, ImageStyle, StyleProp } from 'react-native';
import FastImage, { FastImageSource } from 'react-native-fast-image';
import preloader2 from '@assets/preloaders/preloader2.gif';

interface CachedImageLoadedProps {
  imageUrl?: string;
  defaultImage: FastImageSource;
  style: StyleProp<ImageStyle>
}

export const CachedImageLoaded: React.FC<CachedImageLoadedProps> = (props: CachedImageLoadedProps) => {
  const { imageUrl, style, defaultImage } = props;
  const [ loadingStatus, setLoadingStatus ] = useState(!!imageUrl);
  const source = imageUrl ? { uri: imageUrl } : defaultImage;

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