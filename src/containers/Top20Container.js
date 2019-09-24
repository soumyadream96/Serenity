import React from 'react';
import {withNavigation} from 'react-navigation';
import AlbumScrollView from '../components/AlbumScrollView';

class Top20Container extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {isLoading: true, data: []};
  }

  componentDidMount() {
    try {
      fetch(
        'https://gist.githubusercontent.com/YajanaRao/afddeb588e2e299de1b0ced2db0f195b/raw/e525763fde0697e9e4da5bc40179628997741f97/top20.json',
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            isLoading: false,
            data: responseJson,
          });
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }

  navigateToSongs = (songs, artwork, title) => {
    this.props.navigation.navigate('Songs', {
      songs: songs,
      img: artwork,
      title: title,
    });
  };
  render() {
    return (
      <AlbumScrollView
        title={'Top 15'}
        data={this.state.data}
        navigateToSongs={this.navigateToSongs}
      />
    );
  }
}

export default withNavigation(Top20Container);
