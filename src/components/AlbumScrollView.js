import React from 'react';
import { Title, Paragraph } from 'react-native-paper';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';

const AlbumScrollView = ({ data, title, navigateToSongs }) => (
  <View style={{ flex: 1 }}>
    {data ? <Title style={styles.title}>{title}</Title> : false}
    <FlatList
      horizontal
      data={data}
      keyExtractor={(item, index) => index.toString()}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigateToSongs(item)}
        >
          <FastImage source={{ uri: item.artwork }} style={styles.photo} />
          <Paragraph numberOfLines={1}>{item.album}</Paragraph>
        </TouchableOpacity>
      )}
    />
  </View>
);

AlbumScrollView.propTypes = {
  data: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
};

export default AlbumScrollView;

const styles = StyleSheet.create({
  title: {
    paddingTop: 10,
    textAlign: 'center',
  },
  item: {
    marginLeft: 12,
    marginBottom: 4,
    alignItems: 'center',
    height: 120,
    width: 120,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    elevation: 4,
  },
});
