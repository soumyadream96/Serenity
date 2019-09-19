import React from 'react';
import {ImageBackground, View} from 'react-native';
import {Title} from 'react-native-paper';

export default Quote = props => {
  return (
    <View style={{flex: 1}}>
     
      <ImageBackground
        source={{uri: props.backgroundImage}}
        style={{padding: 20, height: 200}}
        blurRadius={1}
        // imageStyle={{borderRadius: 4}}
        >
        <Title>{props.quote}</Title>
      </ImageBackground>
    </View>
  );
};
