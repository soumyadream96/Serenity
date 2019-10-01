import realm from '../database';

import { PLAYLIST_SCHEMA_NAME } from '../database/schema/PlaylistSchema';
import { SONG_SCHEMA_NAME } from '../database/schema/SongSchema';

export const userPlaylistIdPrefix = 'user-playlist--';
export const userSongIdPrefix = 'user-song--';

const _generateId = () => {
    const playlists = realm.objects(PLAYLIST_SCHEMA_NAME).sorted('id', true);
    let max = 1;
    if (playlists.length > 0) {
        max = parseInt(playlists[0].id.split(userPlaylistIdPrefix)[1], 10) + 1;
    }
    // The user can create a max of 100000 playlists :)
    return `${userPlaylistIdPrefix}${max.toString().padStart(6, '0')}`;
};

const _generateSongId = (id) => {
    const songs = realm.objectForPrimaryKey(SONG_SCHEMA_NAME,id);
    console.log(songs, id);
    let max = 1;
    if (songs != undefined) {
        if(songs.length > 0){
            max = parseInt(songs[0].id.split(userSongIdPrefix)[1], 10) + 1;
        }
    }
    // The user can create a max of 100000 playlists :)
    return `${userSongIdPrefix}${max.toString().padStart(6, '0')}`;
};


export const getAllPlaylists = () => {
    return realm.objects(PLAYLIST_SCHEMA_NAME);
}

export const createPlaylist = (playlistName) => {
    realm.write(() => {
        realm.create(PLAYLIST_SCHEMA_NAME, {
            id: _generateId(),
            name: playlistName
        });
    });
    return realm.objects(PLAYLIST_SCHEMA_NAME);
}

export const addSong = (id, song) => {
    realm.write(() => {
        let playlist = realm.objectForPrimaryKey(PLAYLIST_SCHEMA_NAME, id);
        playlist.songs.push({
            id: _generateSongId(id),
            title: song.title,
            artcover: song.artcover,
            artist: song.artist,
            album: song.album,
            url: song.url
        })
    })
}