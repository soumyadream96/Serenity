import * as React from 'react';
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { View } from 'react-native';
import { withTheme, IconButton, Snackbar } from 'react-native-paper';
import { PermissionsAndroid } from 'react-native';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import { connect } from 'react-redux';

import OfflineScreen from './offline';
import SearchScreen from './search';
import HomeScreen from './home';
import ExploreScreen from './explore';
import PlayerScreen from './shared/Player';
import TabBar from '../components/TabBar';


const BottomNavigator = createBottomTabNavigator({
 Home: {
   screen: HomeScreen,
   navigationOptions: {
     tabBarIcon: ({ tintColor }) => <IconButton icon="home" color={tintColor} style={{ margin: 0, padding: 0 }} />
   }
 },
 Search: {
   screen: SearchScreen,
   navigationOptions: {
     tabBarIcon: ({ tintColor }) => <IconButton icon="search" color={tintColor} style={{ margin: 0, padding: 0 }} />
   }
 },
 Explore: {
   screen: ExploreScreen,
   navigationOptions: {
     tabBarIcon: ({ tintColor }) => <IconButton icon="explore" color={tintColor} style={{ margin: 0, padding: 0 }} />
   }
 },
 Offline: {
   screen: OfflineScreen,
   navigationOptions: {
     tabBarIcon: ({ tintColor }) => <IconButton icon="save" color={tintColor} style={{ margin: 0, padding: 0 }} />
   }
 }
},
 {
   tabBarComponent: TabBar
 });


const RootStack = createStackNavigator(
  {
    Main: {
      screen: BottomNavigator,
    },
    Player: {
      screen: PlayerScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

const Navigator = createAppContainer(RootStack);

class RootScreen extends React.Component {
  state = {
    visible: false,
    result: ''
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Home',
      headerRight: (
        <IconButton
          icon="settings"
          color={'black'}
          onPress={() => navigation.navigate('Settings')}
        />
      )
    }
  };

  requestPermission = () => {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Serenity App READ_EXTERNAL_STORAGE Permission',
          message:
            'Serenity App needs access to your READ_EXTERNAL_STORAGE ' +
            'so you can take play offline songs.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      ).then((granted) => {
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {

        } else {
        }
      })
    } catch (err) {
      console.warn(err);
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.result, state.result)) {
      return {
        result: props.result,
        visible: true
      }
    }
    return null
  }

  componentDidMount = () => {
    this.requestPermission();
  }



  render() {

    const { colors } = this.props.theme;

    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        { !isEmpty(this.state.result) ?       
        <Snackbar
          style={{ marginBottom: 120, zIndex: 10 }}
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          // duration={1000}
          action={{
            label: 'Dismiss',
            onPress: () => {
              this.setState({
                visible: false
              })
            },
          }}
        >
          {this.state.result}
        </Snackbar> : false }
       
        <Navigator screenProps={{ theme: this.props.theme }}/>
      </View>

    )
  }
}


const mapStateToProps = state => ({
  result: state.playerState.result
});

export default connect(mapStateToProps)(withTheme(RootScreen));