import React, { Component } from 'react';
import { IconButton } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addToQueue } from '../../actions/playerState';
import SwipeListContainer from '../../containers/SwipeListContainer';
import Screen from '../../components/Screen';

class Songs extends Component {
  static navigationOptions = ({ navigation }) => {
    // header: null
    return {
      headerTitle: navigation.getParam('title'),
      headerRight: (
        <IconButton
          icon="play-circle-outline"
          onPress={navigation.getParam('addToQueue')}
        />
      ),
    };
  };

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ addToQueue: this.addSongsToQueue });
  }

  addSongsToQueue = () => {
    const { navigation, addToQueue } = this.props;
    const songs = navigation.getParam('songs');
    addToQueue(songs);
  };

  render() {
    const { navigation } = this.props;

    const songs = navigation.getParam('songs', []);
    const albumImage = navigation.getParam('img');
    const title = navigation.getParam('title', 'No Title');

    return (
      <Screen>
        <View style={styles.scrollViewContent}>
          <SwipeListContainer data={songs} cover={albumImage} title={title} />
          <View style={{ height: 100 }} />
        </View>
      </Screen>
    );
  }
}

Songs.propTypes = {
  navigation: PropTypes.object.isRequired,
  addToQueue: PropTypes.func.isRequired,
};

export default connect(
  null,
  { addToQueue },
)(Songs);

const styles = StyleSheet.create({
  scrollViewContent: {
    marginTop: 10,
  },
});
