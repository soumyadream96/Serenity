import * as React from 'react';
import { createMaterialTopTabNavigator, createAppContainer, createStackNavigator } from 'react-navigation';
import { View } from 'react-native';
import { withTheme, IconButton, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';

import Player from '../components/Player';
import PlayListScreen from '../components/PlayList';
import OfflineMedia from './sub/Offline';
import SearchScreen from './sub/Search';
import TabBar from '../components/TabBar';
import MainScreen from './sub/Main';
import AlbumScreen from './sub/Album';
import MusicScreen from './sub/Music';
import NetworkContainer from '../containers/NetworkContainer'
import NavBar from '../components/NavBar';


class MediaScreen extends React.Component {
  state = {
    visible: false,
    message: ''
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.result) {
      this.setState({
        visible: true,
        message: nextProps.result
      });
    }
  }


  render() {

    const { colors } = this.props.theme;


    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <NavBar style={{ backgroundColor: colors.primary }}/>
        <Navigator />
        <Player/>
        <Snackbar
          style={{ marginBottom: 60 }}
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
          action={{
            label: 'Dismiss',
            onPress: () => {
              this.setState({
                visible: false
              })
            },
          }}
        >
          {this.state.message}
        </Snackbar>
      </View>

    )
  }
}




const MediaNavigator = createStackNavigator({
  Home: { screen: MainScreen },
  Songs: { screen: PlayListScreen },
  Music: { screen: MusicScreen }
});


const AppContainer = createAppContainer(MediaNavigator);

class HomeScreen extends React.Component {
  render() {
    return (
      // <NetworkContainer>
        <AppContainer />
      // </NetworkContainer>
    )

  }
}




const Navigator = createAppContainer(createMaterialTopTabNavigator({
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
  Albums: {
    screen: AlbumScreen,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <IconButton icon="library-music" color={tintColor} style={{ margin: 0, padding: 0 }} />
    }
  },
  Offline: {
    screen: OfflineMedia,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <IconButton icon="save" color={tintColor} style={{ margin: 0, padding: 0 }} />
    }
  }
},
  {
    tabBarComponent: TabBar
  }));


const mapStateToProps = state => ({
  result: state.media.result
});


export default connect(mapStateToProps)(withTheme(MediaScreen));