import values from 'lodash/values';

import realm from '../database';

import { PLAYLIST_SCHEMA_NAME } from '../database/schema/PlaylistSchema';
import { SONG_SCHEMA_NAME } from '../database/schema/SongSchema';
import { ARTIST_SCHEMA_NAME } from '../database/schema/ArtistSchema';
import { ALBUM_SCHEMA_NAME } from '../database/schema/AlbumSchema';

export const userPlaylistIdPrefix = 'user-playlist--';
export const userSongIdPrefix = 'user-song--';
export const artistIdPrefix = 'artist--';

const _generateId = () => {
  const playlists = realm.objects(PLAYLIST_SCHEMA_NAME).sorted('id', true);
  let max = 1;
  if (playlists.length > 0) {
    max = parseInt(playlists[0].id.split(userPlaylistIdPrefix)[1], 10) + 1;
  }
  // The user can create a max of 100000 playlists :)
  return `${userPlaylistIdPrefix}${max.toString().padStart(6, '0')}`;
};

const _generateArtistId = () => {
  const artists = realm.objects(ARTIST_SCHEMA_NAME).sorted('id', true);
  let max = 1;
  if (artists.length > 0) {
    max = parseInt(artists[0].id.split(artistIdPrefix)[1], 10) + 1;
  }
  return `${artistIdPrefix}${max.toString().padStart(6, '0')}`;
};

const _generateSongId = () => {
  const songs = realm.objects(SONG_SCHEMA_NAME).sorted('id', true);
  let max = 1;
  if (songs.length > 0) {
    max = parseInt(songs[0].id.split(userSongIdPrefix)[1], 10) + 1;
  }
  // The user can create a max of 100000 playlists :)
  return `${userSongIdPrefix}${max.toString().padStart(6, '0')}`;
};

export const defaultDBSetup = () => {
  realm.write(() => {
    realm.create(PLAYLIST_SCHEMA_NAME, {
      id: `${userPlaylistIdPrefix}000001`,
      name: 'Recently Played',
      owner: 'Serenity',
    });

    realm.create(PLAYLIST_SCHEMA_NAME, {
      id: `${userPlaylistIdPrefix}000002`,
      name: 'Favourite',
      owner: 'Serenity',
    });

    realm.create(PLAYLIST_SCHEMA_NAME, {
      id: `${userPlaylistIdPrefix}000003`,
      name: 'Queue',
      owner: 'Serenity',
    });
  });
};

export const getAllPlaylists = () => {
  return realm.objects(PLAYLIST_SCHEMA_NAME);
};

export const getQueuedSongs = () => {
  try {
    return values(
      realm.objectForPrimaryKey(PLAYLIST_SCHEMA_NAME, 'user-playlist--000003')
        .songs,
    );
  } catch (error) {
    console.log('getQueuedSongs: ', error);
  }
};

export const getPlayedSongs = () => {
  try {
    return realm.objectForPrimaryKey(
      PLAYLIST_SCHEMA_NAME,
      'user-playlist--000001',
    ).songs;
  } catch (error) {
    console.log('getPlayedSongs: ', error);
  }
};

export const createPlaylist = playlistName => {
  realm.write(() => {
    realm.create(PLAYLIST_SCHEMA_NAME, {
      id: _generateId(),
      name: playlistName,
      owner: 'You',
    });
  });
  return true;
};

export const removeSong = (id, song) => {
  try {
    realm.write(() => {
      const playlist = realm.objectForPrimaryKey(PLAYLIST_SCHEMA_NAME, id);
      const item = playlist.songs.filtered(`id = $0`, song.id);
      realm.delete(item);
    });
  } catch (error) {
    console.log('removeSong: ', error);
  }
};

export const addSong = (id, songs) => {
  try {
    realm.write(() => {
      const playlist = realm.objectForPrimaryKey(PLAYLIST_SCHEMA_NAME, id);
      if (Array.isArray(songs)) {
        songs.forEach(song => {
          playlist.songs.push({
            id: _generateSongId(),
            title: song.title,
            artwork: song.artwork,
            artist: song.artist,
            album: song.album,
            url: song.url,
          });
        });
      } else {
        playlist.songs.push({
          id: _generateSongId(),
          title: songs.title,
          artwork: songs.artwork,
          artist: songs.artist,
          album: songs.album,
          url: songs.url,
        });
      }
    });
  } catch (error) {
    console.log('addSong: ', error, songs);
  }
};

export const clearAllSongs = id => {
  try {
    realm.write(() => {
      const playlist = realm.objectForPrimaryKey(PLAYLIST_SCHEMA_NAME, id);
      realm.delete(playlist.songs);
    });
  } catch (error) {
    console.log('clearAllSongs: ', error);
  }
};

export const deletePlaylist = id => {
  realm.write(() => {
    const playlist = realm.objectForPrimaryKey(PLAYLIST_SCHEMA_NAME, id);
    console.log(playlist);
    realm.delete(playlist);
  });
};

export const renamePlaylist = (id, playlistName) => {
  realm.write(() => {
    realm.create(
      PLAYLIST_SCHEMA_NAME,
      {
        id,
        name: playlistName,
      },
      true,
    );
  });
};

export const addArtist = artists => {
  console.log('adding artist to array', artists);
  realm.write(() => {
    if (Array.isArray(artists)) {
      artists.forEach(artist => {
        realm.create(ARTIST_SCHEMA_NAME, {
          id: _generateArtistId(),
          name: artist.name,
          cover: artist.cover,
        });
      });
    } else {
      realm.create(ARTIST_SCHEMA_NAME, {
        id: _generateArtistId(),
        name: artists.name,
        cover: artists.cover,
      });
    }
  });
};

export const addAlbum = album => {
  realm.write(() => {
    realm.create(ALBUM_SCHEMA_NAME, {
      name: album.name,
      cover: album.cover,
      artist: album.artist,
    });
  });
};

export const getArtists = () => {
  try {
    return values(realm.objects(ARTIST_SCHEMA_NAME));
  } catch (error) {
    console.log('getArtists: ', error);
  }
};
