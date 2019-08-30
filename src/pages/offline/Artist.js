import { FlatList } from "react-native-gesture-handler";
import React from "react";
import {
  withTheme,
  Divider,
  Title,
  List,
  Button,
  IconButton
} from "react-native-paper";
import { View, StyleSheet, RefreshControl } from "react-native";
import FastImage from "react-native-fast-image";
import { isEqual, isEmpty } from "lodash";
import { connect } from "react-redux";

import { getOfflineArtists } from "../../actions/mediaStore";

class Artist extends React.PureComponent {
  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props);
    this.state = {
      artists: [],
      refreshing: false
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.artists, state.artists)) {
      return {
        artists: props.artists,
        refreshing: false
      };
    }
    return null;
  }

  fetchData = () => {
    this.setState({
      refreshing: true
    });
    this.props.getOfflineArtists();
  };

  componentDidMount() {
    this.props.getOfflineArtists();
  }

  render() {
    const {
      theme: {
        colors: { background }
      }
    } = this.props;

    const { navigate } = this.props.navigation;

    if (!isEmpty(this.state.artists)) {
      return (
        <View style={{ flex: 1, backgroundColor: background }}>
          <FlatList
            data={this.state.artists}
            ItemSeparatorComponent={() => <Divider inset={true} />}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.fetchData}
              />
            }
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <List.Item
                title={item.artist}
                description={item.numberOfSongs + " Songs"}
                left={props => <List.Icon {...props} icon="person" />}
                onPress={() =>
                  navigate("Filter", {
                    artist: item.artist,
                    title: item.artist
                  })
                }
              />
            )}
          />
        </View>
      );
    }
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: background,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <IconButton icon="sentiment-very-dissatisfied" />
        <Title>No offline Artists found..</Title>
        <Button
          icon="refresh"
          mode="outlined"
          onPress={this.fetchData}>
          Refresh
        </Button>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  artists: state.mediaStore.artists
});

export default connect(
  mapStateToProps,
  { getOfflineArtists }
)(withTheme(Artist));

const styles = StyleSheet.create({
  icons: {
    width: 60,
    height: 60,
    borderRadius: 30
  }
});
