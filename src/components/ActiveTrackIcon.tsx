import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { useSelector } from 'react-redux';
import { View, ViewStyle } from 'react-native';
import Animations from '../assets/Animations';

interface ActiveTrackIconProps {
  style: ViewStyle;
}

const ActiveTrackIcon = ({ style }: ActiveTrackIconProps) => {
  const animatedRef = useRef(null);
  const status = useSelector((state: any) => state.playerState.status);

  useEffect(() => {
    if (status === 'playing') {
      animatedRef.current.play();
    } else {
      animatedRef.current.pause();
    }
  }, [status]);

  return (
    <View style={[style, { justifyContent: 'center', alignItems: 'center' }]}>
      <LottieView ref={animatedRef} source={Animations.playerAnimation} />
    </View>
  );
};
export default ActiveTrackIcon;
