import React, { useCallback, useEffect, useState } from 'react';
import { View, ImageStyle, StyleProp } from 'react-native';
import FastImage, { FastImageSource } from 'react-native-fast-image';
import preloader2 from '@assets/preloaders/preloader2.gif';
import { imageViewRequestOptions } from '@api/utils';

interface CachedImageLoadedProps {
  s3Key?: string;
  imageUrl?: string;
  defaultImage: FastImageSource;
  style: StyleProp<ImageStyle>;
}

export const CachedImageLoaded: React.FC<CachedImageLoadedProps> = (props: CachedImageLoadedProps) => {
  const { imageUrl, style, defaultImage, s3Key } = props;

  if (!imageUrl && !s3Key) {
    return (
      <View>
        <FastImage source={defaultImage} style={style} />
      </View>
    );
  }


  const [ loadingStatus, setLoadingStatus ] = useState(true);
  const [ source, setSource ] = useState(imageUrl && { uri: imageUrl });

  const getTargetUrl = useCallback(() => {
    if (s3Key) {
      return imageViewRequestOptions(s3Key).then(setSource);
    }
  }, [s3Key]);

  useEffect(() => {
    getTargetUrl();
  }, [getTargetUrl]);

  return (
    <View>
      { loadingStatus && (
        <FastImage 
          source={preloader2}
          style={[ style, { position: 'absolute' } ]}
        />
      )}
      { source && (
        <FastImage 
          source={source}
          style={style}
          onLoadEnd={() => setLoadingStatus(false)}
        />
      )}
    </View>
  );
}