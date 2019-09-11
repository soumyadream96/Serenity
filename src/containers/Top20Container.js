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
        'https://dl.dropboxusercontent.com/s/1yclr05vm4l49ws/top20.json?dl=0',
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
