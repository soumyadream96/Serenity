import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import { Headline } from '@serenity/components';
import { Track } from '../../components/Track';
import { SongProps } from '@serenity/core';
import { Songs } from '@serenity/extensions';
import { useNavigation } from '@react-navigation/core';
import { useQuery } from 'react-query';

const PlaylistList = () => {
  const netInfo = useNetInfo();
  const navigation = useNavigation();

  const { data, isLoading } = useQuery('playlists', () => Songs.getPlaylists())

  const navigateToSongs = (item: any) => {
    navigation.navigate("Songs", { playlist: item });
  }

  if (netInfo.isConnected && !isLoading) {
    return (
      <View>
        <Headline style={styles.title}>Songs</Headline>
        <FlatList
          horizontal
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 14 }}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }: { item: SongProps }) => <Track track={item} onPress={navigateToSongs} />}
        />
      </View>
    );
  }

  return null;
};

export default PlaylistList;

const styles = StyleSheet.create({
  title: {
    marginLeft: 16,
  }
});
