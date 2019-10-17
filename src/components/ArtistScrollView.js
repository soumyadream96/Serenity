import React from 'react';
import { Paragraph, Title } from 'react-native-paper';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

const ArtistScrollView = ({ data, title, navigateToSongs }) => {
  return (
    <View>
      {data ? <Title style={styles.title}>{title}</Title> : false}
      <FlatList
        horizontal
        data={data}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigateToSongs(item.songs, item.artwork, item.album)
            }
          >
            <FastImage source={{ uri: item.artwork }} style={styles.artist} />
            <Paragraph numberOfLines={1}>{item.album}</Paragraph>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

ArtistScrollView.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default ArtistScrollView;

const styles = StyleSheet.create({
  title: {
    paddingTop: 10,
    textAlign: 'center',
  },
  item: {
    marginLeft: 12,
    marginBottom: 4,
    alignItems: 'center',
  },
  artist: {
    width: 120,
    height: 120,
    borderRadius: 60,
    elevation: 1,
  },
});
