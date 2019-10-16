import React, {Component} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {
  withTheme,
  Avatar,
  List,
  Dialog,
  Portal,
  Button,
  Searchbar,
  ActivityIndicator,
} from 'react-native-paper';
import PropTypes from 'prop-types';

import ArtistComponent from '../../components/ArtistComponent';
import {addArtist, getArtists} from '../../actions/realmAction';
import realm from '../../database';

class Artist extends Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      visible: false,
      addArtists: [],
      artists: [],
    };
  }

  componentDidMount() {
    try {
      fetch(
        'https://dl.dropboxusercontent.com/s/ju7jj3uttzw1vow/artist.json?dl=0',
      )
        .then(response => response.json())
        .then(responseJson => {
          this.setState({
            data: responseJson,
            artists: getArtists(),
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({
            visible: false,
            artists: getArtists(),
          });
        });
      realm.addListener('change', () => {
        this.setState({
          artists: getArtists(),
        });
      });
    } catch (error) {
      console.log(error);
    }
  }

  componentWillUnmount() {
    realm.removeAllListeners();
  }

  addArtistsToArray = artist => {
    let data = [];
    data['name'] = artist.artist;
    data['cover'] = artist.artwork;
    this.state.addArtists.push(data);
  };

  addArtists = () => {
    addArtist(this.state.addArtists);
    this._hideDialog();
  };

  _showDialog = () => this.setState({visible: true});

  _hideDialog = () => this.setState({visible: false});

  render() {
    const {colors} = this.props.theme;
    return (
      <View style={{backgroundColor: colors.background, flex: 1}}>
        <FlatList
          ListHeaderComponent={() => (
            <List.Item
              title="Add artist"
              left={props => (
                <Avatar.Icon
                  {...props}
                  style={{backgroundColor: colors.surface}}
                  icon="add"
                />
              )}
              onPress={this._showDialog}
            />
          )}
          data={this.state.artists}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <List.Item
              title={item.name}
              left={props => (
                <Avatar.Image {...props} source={{uri: item.cover}} />
              )}
              // onPress={this._showDialog}
            />
          )}
        />
        <Portal>
          <Dialog visible={this.state.visible} onDismiss={this._hideDialog}>
            <Dialog.Title>Choose more artists you like.</Dialog.Title>
            <Dialog.Content>
              <Searchbar
                placeholder="Search"
                onChangeText={query => {
                  this.setState({firstQuery: query});
                }}
                value={this.state.firstQuery}
              />
            </Dialog.Content>
            <Dialog.ScrollArea>
              {this.state.data.length ? (
                <FlatList
                  data={this.state.data}
                  keyExtractor={(item, index) => index.toString()}
                  numColumns={3}
                  renderItem={({item}) => (
                    <ArtistComponent
                      item={item}
                      addArtist={this.addArtistsToArray}
                    />
                  )}
                />
              ) : (
                <View style={{margin: 16}}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            </Dialog.ScrollArea>
            <Dialog.Actions>
              <Button onPress={this._hideDialog}>Cancel</Button>
              <Button onPress={this.addArtists}>Ok</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}
export default withTheme(Artist);

Artist.propTypes = {
  theme: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};
