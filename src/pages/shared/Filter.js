import React, { Component } from 'react';
import { IconButton } from 'react-native-paper';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { addToQueue } from '../../actions/playerState';
import { filterSongsByGenre } from '../../actions/mediaStore';
import SongListContainer from '../../containers/SongListContainer';
import Screen from '../../components/Screen';

class Filter extends Component {
  static navigationOptions = ({ navigation }) => {
    const {
      params: { genre },
    } = navigation.state;
    return {
      headerTitle: genre.title,
      headerRight: (
        <IconButton
          icon="play-circle-outline"
          onPress={navigation.getParam('addToQueue')}
        />
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      songs: [],
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.fetchData();
    navigation.setParams({ addToQueue: this.addToQueue });
  }

  addSongsToQueue = () => {
    const { addToQueue } = this.props;
    const { songs } = this.state;
    addToQueue(songs);
  };

  fetchData = async () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const genre = params.genre.title;
    const songs = await filterSongsByGenre(genre);
    this.setState({
      songs,
    });
    // if (params.artist) {
    //   findArtistSongs(collection.artist);
    // } else if (params.album) {
    //   findAlbumSongs(collection.album);
    // }
  };

  render() {
    const { navigation } = this.props;
    const { songs } = this.state;

    const {
      params: { genre },
    } = navigation.state;

    return (
      <Screen>
        <SongListContainer
          data={songs}
          fetchData={this.fetchData}
          title={genre.title}
          cover={genre.image}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => ({
  files: state.mediaStore.files,
});

Filter.propTypes = {
  navigation: PropTypes.object.isRequired,
  addToQueue: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  { addToQueue },
)(Filter);
