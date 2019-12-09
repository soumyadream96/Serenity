import React, { useState, SetStateAction } from 'react';
import { View } from 'react-native';
import isEmpty from 'lodash/isEmpty';

import { PlaylistDialog } from './PlaylistDialog';
import { SwipeList } from './SwipeList';
import { EmptyPlaylist } from './EmptyPlaylist';
import { Container } from './Container';

import { TrackProps } from '../types';

interface SongListProps {
  data: TrackProps[];
  title: string;
  cover: string;
  addToQueue(songs: TrackProps | TrackProps[]): void;
  addToPlaylist(id: string, track: TrackProps): void;
  fetchData(): void;
}

export function SongList({
  data,
  title,
  cover,
  addToQueue,
  addToPlaylist,
  fetchData,
}: SongListProps) {
  const [visible, setVisibility] = useState(false);
  const [song, setSong] = useState();

  function showModal(track: SetStateAction<null>) {
    setVisibility(true);
    setSong(track);
  }

  function hideModal() {
    setVisibility(false);
  }

  function addSongToPlaylist(id: string) {
    addToPlaylist(id, song);
    hideModal();
  }

  return (
    <Container>
      {!isEmpty(data) ? (
        <View>
          <PlaylistDialog
            visible={visible}
            hideModal={hideModal}
            addToPlaylist={addSongToPlaylist}
          />
          <SwipeList
            data={data}
            title={title}
            cover={cover}
            addToQueue={addToQueue}
            fetchData={fetchData}
            showModal={showModal}
          />
        </View>
      ) : (
        <EmptyPlaylist />
      )}
    </Container>
  );
}
