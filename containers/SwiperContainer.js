import * as React from 'react';
import { View, StyleSheet, Animated, Text } from 'react-native';
import { withTheme, IconButton } from 'react-native-paper';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { downloadMedia, addToQueue, removeFromQueue } from '../actions';

class SwiperContainer extends React.Component {
  
  renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-20, 0, 0, 1],
    });
    const methodToCall = () => {
      this.close()
      console.log(progress)
      this.removeFromQueue()
    }
    return (
      <RectButton style={styles.leftAction} onPress={methodToCall}>
        <IconButton
          icon="delete"
          color='white'
          // size={20}
          onPress={() => console.log('Pressed')}
        />
      </RectButton>
    );
  };

  download = () => {
    const item = this.props.children.props.children.props.item;
    console.log(item);
    if(item){
      alert("downloading", item.title)
      this.props.downloadMedia(item)
    }
  }

  addToQueue = () => {
    const item = this.props.children.props.children.props.item;
    console.log(item);
    if(item){
      this.props.addToQueue(item);
    }
  }

  removeFromQueue = () => {
    const item = this.props.children.props.children.props.item;
    console.log(item);
    if (item) {
      this.props.close();
      this.props.removeFromQueue(item);
    }
  }

  renderRightAction = (text, color, x, progress,action) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const methodToCall = () => {
      this.close()
      console.log(progress)
      action()
    }

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={methodToCall}>
          {/* <Text style={styles.actionText}>{text}</Text> */}
          <IconButton
            icon="add-to-queue"
          />
        </RectButton>
      </Animated.View>
    );
  };

  renderDownloadAction = (color, x, progress, action) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const methodToCall = () => {
      this.close()
      console.log(progress)
      action()
    }

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={methodToCall}>
          <IconButton
            icon="get-app"
            // color={Colors.red500}
            // size={20}
            onPress={() => console.log('Pressed')}
          />
        </RectButton>
      </Animated.View>
    );
  };


renderDeleteAction = (color, x, progress, action) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const methodToCall = () => {
      this.close()
      console.log(progress)
      action()
    }

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={[styles.rightAction, { backgroundColor: color }]}
          onPress={methodToCall}>
          <IconButton
            icon="delete"
            // color={Colors.red500}
            // size={20}
            onPress={() => console.log('Pressed')}
          />
        </RectButton>
      </Animated.View>
    );
  };


  renderRightActions = progress => (
    <View style={{ width: 192, flexDirection: 'row' }}>
      {this.renderDownloadAction('#C8C7CD', 192, progress, this.download )}
      {this.renderRightAction('Flag', '#ffab00', 128, progress, this.addToQueue)}
      {this.renderDeleteAction('#497AFC', 64, progress,  this.action)}
    </View>
  );

  updateRef = ref => {
    this._swipeableRow = ref;
  };
  close = () => {
    this._swipeableRow.close();
  };

  render(){
    const { children } = this.props;
    return ( 
      <Swipeable 
        ref={this.updateRef}
        friction={2}
        leftThreshold={30}
        rightThreshold={40}
        onSwipeableLeftOpen={this.removeFromQueue}
        renderLeftActions={this.renderLeftActions}  
        renderRightActions={this.renderRightActions}>
        {children}
    </Swipeable>
      
    );
  }
} 
 


const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
  },
  rightAction: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  }
});

export default connect(null, { downloadMedia, addToQueue, removeFromQueue })(withTheme(SwiperContainer));