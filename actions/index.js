import { DarkTheme, DefaultTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import _ from 'lodash';
import * as RNFS from 'react-native-fs'; 

export const updateQuery = (query) => dispatch => {
  dispatch({
    type: 'UPDATE_QUERY',
    payload: query
  });
}

export const updateTheme = (theme) => dispatch => {
  let Theme = (theme === DarkTheme ? DefaultTheme : DarkTheme);
  dispatch({
    type: 'UPDATE_THEME',
    payload: Theme
  })
}

const _downloadFileProgress = (data) => {
  const percentage = ((100 * data.bytesWritten) / data.contentLength) | 0;
  const text = `Progress ${percentage}%`;
  console.log(text);
  if (percentage == 100) {
    console.log("done")
  }
}


export const downloadMedia = (item) => dispatch => {
  try {
    console.log("downloading file",item);
    if(item){
      RNFS.downloadFile({
        fromUrl: item.url,
        toFile: `${RNFS.DocumentDirectoryPath}/${item.title}.mp3`,
        progress: (data) => _downloadFileProgress(data),
      }).promise.then(() => {
        console.log("downloaded file")
        dispatch({
          type: 'DOWNLOAD',
          payload: [{
            title: item.title,
            url: `${RNFS.DocumentDirectoryPath}/${item.title}.mp3`,
            artwork: "https://raw.githubusercontent.com/YajanaRao/Serenity/master/assets/icons/app-icon.png",
            artist: "Serenity"
          }]
        })
      })
    }
  } catch (error) {
    console.log(error);
  }
}

export const getOfflineMedia =  () => dispatch => {
  RNFS.readdir(RNFS.DocumentDirectoryPath).then(files => {
    let response = []
    _.forEach(files, function (value) {
      if (_.endsWith(value, 'mp3')){
        RNFS.exists(RNFS.DocumentDirectoryPath + '/' + value).then(() => {
          response.push({
            id: `file:/${RNFS.DocumentDirectoryPath}/${value}`,
            title: value.split('.')[0],
            url: `file:/${RNFS.DocumentDirectoryPath}/${value}`,
            artwork: "https://raw.githubusercontent.com/YajanaRao/Serenity/master/assets/icons/app-icon.png",
            artist: "Serenity"
          })
        })
      }
    });
    dispatch({
      type: 'OFFLINE',
      payload: response
    })
  })
  .catch (err => {
    console.log(err.message, err.code);
  });
}

export const previousMedia = () => dispatch => {
  dispatch({
    type: 'PREVIOUS'
  })
}

export const nextMedia = () => dispatch => {
  dispatch({
    type: 'NEXT'
  })
}

export const playMedia = (item) => dispatch => {
  if(item){
    TrackPlayer.getCurrentTrack().then((trackId) => {
      if (trackId != item.id) {
        TrackPlayer.skip(item.id).then(() => {
          TrackPlayer.play();
          dispatch({
            type: 'PLAY',
            payload: item
          })
        })
          .catch((error) => {
            console.log("got error in play action", error)
            TrackPlayer.add(item).then(() => {
              TrackPlayer.skip(item.id)
              .then(() => {
                TrackPlayer.play();
                dispatch({
                  type: 'PLAY',
                  payload: item
                })
              })
              .catch((error) => {
                console.log(error)
              })
            })
          })
      }
    })
    .catch((error) => {
      console.log("error in getting the current track", error)
    }) 
  }else {
    console.log("no item",item);
  }
}



export const addToQueue = (song) => dispatch => {
  TrackPlayer.getQueue().then((queue) => {
    let update = _.difference(song,queue);
    if(!_.isEmpty(update)){
      TrackPlayer.add(update);
      TrackPlayer.play();
      dispatch({
        type: 'UPDATE_QUEUE',
        payload: _.concat(queue, update)
      })
    }
  })
  .catch((error) => {
    console.log("get error while adding to queue", error)
  })
}

export const removeFromQueue = (song) => dispatch => {
  console.log("removing songs from queue");
  TrackPlayer.remove(song).then(() => {
    TrackPlayer.getQueue().then((queue) => {
      dispatch({
        type: 'UPDATE_QUEUE',
        payload: queue
      })
    })
    
  })
}

export const clearQueue = () => dispatch => {
  TrackPlayer.reset();
  dispatch({
    type: 'CLEAR_QUEUE',
    payload: []
  })  
}

export const activeTrackUpdate = (trackId) => dispatch => {
  TrackPlayer.getTrack(trackId)
    .then((track) => {
      if (track) {
        dispatch({
          type: 'ACTIVE_TRACK_UPDATE',
          payload: track
        })
      }
    })
}

export const fetchTopAlbums = () => dispatch => {
  console.log("fetching top albums from last.fm")
  fetch('http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=disco&api_key=fe67816d712b419bf98ee9a4c2a1baea&format=json&limit=20')
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({
        type: 'TOP_ALBUMS',
        payload: responseJson.albums.album
      })
    })
    .catch((error) => {
      console.error(error);
    });
}


export const fetchLastFMTopTracks = () => dispatch => {
  console.log("executing last.fm top tracks api");
  fetch('http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=cher&api_key=fe67816d712b419bf98ee9a4c2a1baea&format=json&limit=20')
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({
        type: 'TOP_TRACKS',
        payload: responseJson.toptracks.track
      })
    })
    .catch((error) => {
      console.error(error);
    });
}

export const fetchNapsterTopTracks = () => dispatch => {
  console.log("fetching napster top tracks api");
  fetch('https://api.napster.com/v2.1/tracks/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm')
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({
        type: 'TOP_TRACKS',
        payload: responseJson.tracks
      })
    })
    .catch((error) => {
      console.error(error);
    });
}

export const fetchLastFMTopArtists = () => dispatch => {
  console.log("executing last fm api for top artists");
  fetch('http://ws.audioscrobbler.com/2.2/?method=chart.gettopartists&api_key=fe67816d712b419bf98ee9a4c2a1baea&format=json&limit=20')
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({
        type: 'TOP_ARTISTS',
        payload: responseJson.artists.artist
      })
    })
    .catch((error) => {
      console.error(error);
    });
}


export const fetchNapsterTopArtists = () => dispatch => {
  console.log("executing napster api for top artists");
  fetch('https://api.napster.com/v2.2/artists/top?apikey=ZTk2YjY4MjMtMDAzYy00MTg4LWE2MjYtZDIzNjJmMmM0YTdm')
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({
        type: 'TOP_ARTISTS',
        payload: responseJson.artists
      })
    })
    .catch((error) => {
      console.error(error);
    });
}

export const fetchJioSavanData = (type) => dispatch => {
  try {
    console.log("executing jio saavan api");
    fetch('https://www.jiosaavn.com/api.php?__call=content.getHomepageData')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        let response = responseJson._bodyInit.split("-->")[1]
        responseJson = JSON.parse(response.trim())
        if (type === "genres") {
          dispatch({
            type: 'JIO_SAVAN_GENRES',
            payload: responseJson.genres
          })
        }
        else if (type === "charts") {
          dispatch({
            type: 'JIO_SAVAN_CHARTS',
            payload: responseJson.charts
          })
        }
        else if (type === "new_albums") {
          dispatch({
            type: 'JIO_SAVAN_NEW_ALBUMS',
            payload: responseJson.new_albums
          })
        }
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error)
  }
}

export const fetchKannadaTopSongs = () => dispatch => {
  fetch('http://192.168.0.11:5000/api/songs/top/week')
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({
        type: 'TOP_KANNADA',
        payload: responseJson
      })
    })
    .catch((error) => {
      console.error(error);
    });
}

export const fetchBillboardHot100 = () => dispatch => {
  fetch('http://192.168.0.11:5000/api/songs/top/billboard')
    .then((response) => response.json())
    .then((responseJson) => {
      dispatch({
        type: 'HOT_100',
        payload: responseJson.entries
      })
    })
    .catch((error) => {
      console.error(error);
    });
}

export const fetchNetInfo = () => dispatch => {
  console.log("fetching network info");
  dispatch({
    type: 'NET_INFO',
    payload: true
  })
  
}