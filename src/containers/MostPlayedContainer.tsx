import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { View } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import { Title, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/core';

import { deserializeSongs } from '../utils/database';
import { TrackScrollView } from '../components/TrackScrollView';
import { loadTrack } from '../actions/playerState';
import { getPlayedSongs } from '../actions/realmAction';
import { TrackProps } from '../types';

export const MostPlayedContainer = () => {
  const navigation = useNavigation();
  const realmSongs = getPlayedSongs();
  const [history, setHistory] = useState(() => {
    return deserializeSongs(realmSongs);
  });
  const dispatch = useDispatch();
  useEffect(() => {
    function listener(songs: any, changes: any) {
      if (
        changes.insertions.length > 0 ||
        changes.modifications.length > 0 ||
        changes.deletions.length > 0
      ) {
        const song = deserializeSongs(songs);
        setHistory(song);
      }
    }
    if (realmSongs !== undefined) {
      realmSongs.addListener(listener);
    }
    return () => {
      realmSongs.removeListener(listener);
    };
  }, []);

  const play = (track: TrackProps) => {
    if (!isEmpty(track)) {
      dispatch(loadTrack(track));
    }
  };

  const navigateToSongs = React.useMemo(
    () => () => {
      const playlist = {
        id: 'user-playlist--000001',
        name: 'Recent songs',
        owner: 'Serenity',
        songs: history,
      };
      navigation.navigate('Playlist', {
        playlist,
      });
    },
    [navigation],
  );

  if (history.length) {
    return (
      <View>
        <View
          style={{
            marginHorizontal: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title>Most Played songs</Title>
          <Button onPress={navigateToSongs}>More</Button>
        </View>
        <TrackScrollView data={history} play={play} />
      </View>
    );
  }
  return false;
};
