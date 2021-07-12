import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Caption, IconButton, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { includes } from 'lodash';
import { Icon, Screen } from '@serenity/components';
import LinearGradient from 'react-native-linear-gradient';
import { addSongToPlaylist } from '@serenity/core';
import { RepeatContainer } from '../../../containers/RepeatContainer';
import { PlayerController } from '../components/PlayerController';
import { Progress } from './components/ProgressBar';
import { ActiveTrackDetails } from '../components/ActiveTrackDetails';
import { RootReducerType } from '../../../../../core/src/reducers';
import { PlaylistDialog } from '../../../components/Dialogs/PlaylistDialog';
import { downloadMedia } from '../../../../../core/src/actions/download';
import { FavSong } from './components/Fav';
import Images from '../../../assets/Images';

export const PlayerScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [visible, setVisible] = useState('');
  const dispatch = useDispatch();
  const close = () => {
    navigation.goBack();
  };

  const active = useSelector(
    (state: RootReducerType) => state.player.track,
  );

  const addToPlaylist = (id: string) => {
    dispatch(addSongToPlaylist(id, active.id));
    setVisible('');
  };


  function download() {
    dispatch(downloadMedia(active));
    setVisible('');
  }

  return (
    <Screen>
      <ImageBackground
        source={
          active.cover
            ? { uri: active.cover }
            : Images.welcomeImage
        }
        blurRadius={40}
        style={[styles.imageBackground, { backgroundColor: colors.background }]}
      >
        <LinearGradient
          colors={['transparent', colors.background]}
          style={{ flex: 1 }}
        >
          <PlaylistDialog
            visible={visible === 'DIALOG'}
            hideModal={() => setVisible('')}
            addToPlaylist={addToPlaylist}
          />
          <View style={styles.playerContainer}>
            <View style={styles.container}>
              <IconButton icon="close" onPress={close} />
            </View>
            <ActiveTrackDetails track={active} />
            <View style={styles.centerContainer}>
              <Progress />
            </View>
            <View style={styles.playerToolbox}>
              <FavSong id={active.id} type="song" style={{ flex: 1 }} />
              <PlayerController />
              <RepeatContainer />
            </View>
            <View style={styles.extraMenuContainer}>
              <View style={styles.extraIcon}>
                <IconButton
                  size={20}
                  style={{ padding: 0, margin: 0 }}
                  icon={props => <Icon name="menu-outline" {...props} />}
                  onPress={() => navigation.navigate('Queue')}
                />
                <Caption style={{ padding: 0, margin: 0 }}>Queue</Caption>
              </View>
              {includes(
                ['youtube', 'online', 'jiosaavn'],
                active.type?.toLowerCase(),
              ) && (
                  <View style={styles.extraIcon}>
                    <IconButton
                      style={{ padding: 0, margin: 0 }}
                      size={20}
                      icon={props => <Icon name="download-outline" {...props} />}
                      onPress={download}
                    />
                    <Caption>Download</Caption>
                  </View>
                )}
              <View style={styles.extraIcon}>
                <IconButton
                  size={20}
                  style={{ padding: 0, margin: 0 }}
                  icon={props => (
                    <Icon
                      name="folder-add-outline"
                      {...props}
                      style={{ padding: 0, margin: 0 }}
                    />
                  )}
                  onPress={() => setVisible('DIALOG')}
                />
                <Caption>Playlist</Caption>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  playerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  playerToolbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16,
  },
  extraMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 12,
  },
  extraIcon: { justifyContent: 'center', alignItems: 'center' },
});
