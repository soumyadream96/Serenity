import {combineReducers} from 'redux';
import {
  concat,
  remove,
  head,
  isEmpty,
  isArray,
  size,
  union,
  drop,
  shuffle
} from 'lodash';

const INITIAL_QUERY = {
  searchResult: false,
};

const INITIAL_CONFIG = {
  themeType: 'dark',
  repeat: 'repeat-all',
};

const INITIAL_STATE = {
  queue: [],
  favorite: [],
  history: [],
  active: {},
  status: 'init',
};

const DASHBOARD_STATE = {
  topAlbums: [],
  topTracks: [],
  topArtists: [],
  charts: [],
  genres: [],
  newAlbums: [],
  topKannada: [],
  hot100: [],
};

const INITIAL_STORE = {
  songs: [],
  artists: [],
  albums: [],
  files: [],
};

// FIXME: Javascript implementation

export const mediaStoreReducer = (state = INITIAL_STORE, action) => {
  switch (action.type) {
    case 'DOWNLOAD':
      return {
        ...state,
        songs: concat(action.payload, state.songs),
        result: `${action.payload.title} downloaded successfully`,
      };

    case 'OFFLINE_SONGS':
      return {
        ...state,
        songs: action.payload,
      };

    case 'OFFLINE_ARTISTS':
      return {
        ...state,
        artists: action.payload,
      };

    case 'OFFLINE_ALBUMS':
      return {
        ...state,
        albums: action.payload,
      };

    case 'OFFLINE_FILES':
      return {
        ...state,
        files: action.payload,
      };
    default:
      return state;
  }
};

// TODO:
// Normalize queue

export const playerStateReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'STATUS':
      return {
        ...state,
        status: action.status
      };
    case 'LOAD':
      return {
        ...state,
        active: action.track,
        status: action.status,
      };
    case 'NEXT':
      return {
        ...state,
        status: action.status,
        history: isEmpty(action.track)
          ? state.history
          : concat([state.active], state.history),
        active: isEmpty(action.track) ? state.active : action.track,
        queue: isEmpty(state.queue) ? [] : drop(state.queue),
      };

    case 'PREVIOUS':
      return {
        ...state,
        status: action.status,
        active: isEmpty(state.history) ? state.active : head(state.history),
        history: isEmpty(state.history) ? [] : drop(state.history),
      };

    case 'COMPLETED':
      return {
        ...state,
        status: 'paused',
      };

    case 'SHUFFLE_PLAY':
      let queue = shuffle(action.songs);
      return {
        ...state,
        queue: queue,
        active: head(queue)
      }
    case 'ADD_TO_FAVORITE':
      return {
        ...state,
        favorite: union(
          state.favorite,
          [action.payload],
        ),
        result: `Added ${action.payload.title} to favorites`,
      };
    case 'REMOVE_FROM_FAVORITE':
      return {
        ...state,
        favorite: remove(state.favorite, function(n) {
          return n.id != action.payload.id;
        }),
        result: `Removed ${action.payload.title} from favorites`,
      };

    case 'ADD_QUEUE':
      const actionPayloadNormalized = isArray(action.payload) ? action.payload : [ action.payload ]

      if (isEmpty(state.active)) {
        return {
          ...state,
          active: isEmpty(state.queue)
            ? head(actionPayloadNormalized)
            : head(state.queue),
          queue: union(
            state.queue,
            actionPayloadNormalized,
          ),
          result: `Playing songs from the queue`,
        };
      }
      return {
        ...state,
        queue: union(
          state.queue,
          actionPayloadNormalized,
        ),
        result: `Added ${size(actionPayloadNormalized)} songs to queue`,
      };

    case 'REMOVE_QUEUE':
      return {
        ...state,
        queue: remove(state.queue, function(n) {
          return n.id != action.payload.id;
        }),
      };
    case 'CLEAR_QUEUE':
      return {
        ...state,
        queue: action.payload,
        result: 'Queue cleared',
      };

    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: [],
        result: 'History cleared',
      };

    case 'NOTIFY':
      return {
        ...state,
        result: action.payload,
      };
    default:
      return state;
  }
};

export const queryReducer = (state = INITIAL_QUERY, action) => {
  switch (action.type) {
    case 'UPDATE_QUERY':
      return {
        ...state,
        searchResult: action.payload,
      };
    default:
      return state;
  }
};

export const configReducer = (state = INITIAL_CONFIG, action) => {
  switch (action.type) {
    case 'UPDATE_THEME':
      return {
        ...state,
        themeType: action.payload,
      };
    case 'REPEAT':
      return {
        ...state,
        repeat: action.repeat
      }
    default:
      return state;
  }
};

const dashboardReducer = (state = DASHBOARD_STATE, action) => {
  switch (action.type) {
    case 'TOP_ALBUMS':
      return {
        ...state,
        topAlbums: action.payload,
      };
    case 'TOP_TRACKS':
      return {
        ...state,
        topTracks: action.payload,
      };
    case 'TOP_ARTISTS':
      return {
        ...state,
        topArtists: action.payload,
      };
    case 'JIO_SAVAN_CHARTS':
      return {
        ...state,
        charts: action.payload,
      };
    case 'JIO_SAVAN_GENRES':
      return {
        ...state,
        genres: action.payload,
      };
    case 'JIO_SAVAN_NEW_ALBUMS':
      return {
        ...state,
        newAlbums: action.payload,
      };
    case 'TOP_KANNADA':
      return {
        ...state,
        topKannada: action.payload,
      };
    case 'HOT_100':
      return {
        ...state,
        hot100: action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  query: queryReducer,
  config: configReducer,
  playerState: playerStateReducer,
  mediaStore: mediaStoreReducer,
});
