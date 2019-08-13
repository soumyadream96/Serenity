import { combineReducers } from "redux";
import {
  concat,
  remove,
  head,
  isEmpty,
  size,
  union,
  findIndex,
  nth
} from "lodash";

const INITIAL_QUERY = {
  searchResult: []
};

const INITIAL_THEME = {
  themeType: "dark"
};

const INITIAL_STATE = {
  queue: [],
  active: {},
  favorite: [],
  status: "init"
};

const DASHBOARD_STATE = {
  topAlbums: [],
  topTracks: [],
  topArtists: [],
  charts: [],
  genres: [],
  newAlbums: [],
  topKannada: [],
  hot100: []
};

const INITIAL_STORE = {
  songs: [],
  artists: [],
  albums: [],
  files: []
};

// FIXME: Javascript implimentation

const mediaStoreReducer = (state = INITIAL_STORE, action) => {
  switch (action.type) {
    case "DOWNLOAD":
      return {
        ...state,
        songs: concat(action.payload, state.songs),
        result: `${action.payload.title} downloaded successfully`
      };

    case "OFFLINE_SONGS":
      return {
        ...state,
        songs: action.payload
      };

    case "OFFLINE_ARTISTS":
      return {
        ...state,
        artists: action.payload
      };

    case "OFFLINE_ALBUMS":
      return {
        ...state,
        albums: action.payload
      };

    case "OFFLINE_FILES":
      return {
        ...state,
        files: action.payload
      };

    default:
      return state;
  }
};

// TODO:
// Normalise queue

const playerStateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "PLAY":
      return {
        ...state,
        status: "playing",
        result: `Playing ${state.active.title}`
      };
    case "LOAD":
      return {
        ...state,
        active: action.payload,
        queue: union([action.payload], state.queue),
        status: "ready",
      };
    case "PAUSE":
      return {
        ...state,
        status: "paused"
      };
    case "NEXT":
      var index = findIndex(state.queue, function(song) {
        return song.id === state.active.id;
      });
      return {
        ...state,
        active: nth(state.queue, index + 1)
      };

    case "PREVIOUS":
      var index = findIndex(state.queue, function(song) {
        return song.id === state.active.id;
      });
      return {
        ...state,
        active: nth(state.queue, index - 1)
      };
    case "STATUS":
      return {
        ...state,
        status: action.payload
      };

    case "ACTIVE_TRACK_UPDATE":
      return {
        ...state,
        active: action.payload
      };

    case "ADD_TO_FAVORITE":
      return {
        ...state,
        favorite: union(state.favorite, action.payload),
        result: `Added ${action.payload.title} to favorites`
      };
    case "REMOVE_FROM_FAVORITE":
      return {
        ...state,
        favorite: remove(state.favorite, function(n) {
          return n.id != action.payload.id;
        }),
        result: `Removed ${action.payload.title} from favorites`
      };

    case "QUEUE":
      return {
        queue: state.queue
      };
    case "ADD_QUEUE":
      return {
        ...state,
        queue: union(state.queue, action.payload),
        active: head(state.queue),
        result: `Added ${size(action.payload)} songs to queue`
      };

    case "REMOVE_QUEUE":
      return {
        ...state,
        queue: remove(state.queue, function(n) {
          return n.id != action.payload.id;
        })
      };
    case "CLEAR_QUEUE":
      return {
        ...state,
        queue: action.payload,
        active: {},
        result: "Queue cleared"
      };

    case "NOTIFY":
      return {
        ...state,
        result: action.payload
      };
    default:
      return state;
  }
};

const queryReducer = (state = INITIAL_QUERY, action) => {
  switch (action.type) {
    case "UPDATE_QUERY":
      return {
        ...state,
        searchResult: action.payload
      };
    default:
      return state;
  }
};

const themeReducer = (state = INITIAL_THEME, action) => {
  switch (action.type) {
    case "UPDATE_THEME":
      return {
        ...state,
        themeType: action.payload
      };
    default:
      return state;
  }
};

const dashboardReducer = (state = DASHBOARD_STATE, action) => {
  switch (action.type) {
    case "TOP_ALBUMS":
      return {
        ...state,
        topAlbums: action.payload
      };
    case "TOP_TRACKS":
      return {
        ...state,
        topTracks: action.payload
      };
    case "TOP_ARTISTS":
      return {
        ...state,
        topArtists: action.payload
      };
    case "JIO_SAVAN_CHARTS":
      return {
        ...state,
        charts: action.payload
      };
    case "JIO_SAVAN_GENRES":
      return {
        ...state,
        genres: action.payload
      };
    case "JIO_SAVAN_NEW_ALBUMS":
      return {
        ...state,
        newAlbums: action.payload
      };
    case "TOP_KANNADA":
      return {
        ...state,
        topKannada: action.payload
      };
    case "HOT_100":
      return {
        ...state,
        hot100: action.payload
      };
    default:
      return state;
  }
};

export default combineReducers({
  query: queryReducer,
  theme: themeReducer,
  playerState: playerStateReducer,
  mediaStore: mediaStoreReducer
});
