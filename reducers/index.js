import { combineReducers } from 'redux';

import _ from 'lodash';

const INITIAL_QUERY = {
  query: ""
};



const INITIAL_THEME = {
  themeType: false
};

const INITIAL_STATE = {
  result: "",
  queue: [],
  active: {}
}

const DASHBOARD_STATE = {
  topAlbums: [],
  topTracks: [],
  topArtists: [],
  charts: [],
  genres: [],
  newAlbums: [],
  topKannada: [],
  hot100: []
}

const SETTINGS_STATE = {
  isConnected: false
}

const mediaReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'DOWNLOAD':
      return {
        ...state,
        result: "success",
        files: _.concat(action.payload,state.files),
        result: `${action.payload.title} downloaded successfully`
      }

    case 'OFFLINE':
      return {
        ...state,
        files: action.payload
      }
     
    case 'PLAY':
        return {
          ...state,
          active: action.payload,
          queue: _.uniq(_.concat(state.queue, action.payload)),
          result: `Playing ${action.payload.title}`
        }
      
    case 'ACTIVE_TRACK_UPDATE':
      return {
        ...state,
        active: action.payload
      }
    case 'UPDATE_QUEUE': 
      if (_.isEmpty(state.active)){
        return {
          ...state,
          active: _.head(action.payload),
          queue: action.payload,
          result: `Added ${_.size(action.payload)} songs to queue`
        }
      }
      return {
        ...state,
        queue: action.payload
      }
    
    case 'CLEAR_QUEUE':
        return {
          ...state,
          queue: action.payload,
          active: {},
          result: "Queue cleared"
        }
    default:
      return state;
  }
};

const queryReducer = (state = INITIAL_QUERY, action) => {
  switch (action.type) {
    case 'UPDATE_QUERY':
      return {
        ...state,
        query: action.payload
      }
    default:
      return state;
  }
};

const themeReducer = (state = INITIAL_THEME, action) => {
  switch (action.type) {
    case 'UPDATE_THEME':
      return {
        ...state,
        themeType: action.payload
      }
    default:
      return state;
  }
}

const settingsReducer = (state = SETTINGS_STATE, action) => {
  switch(action.type){
    case 'NET_INFO':
      return {
        ...state,
        isConnected: action.payload
      }
    default: 
      return state;
  }
}

const dashboardReducer = (state = DASHBOARD_STATE, action) => {
  switch (action.type) {
    case 'TOP_ALBUMS':
      return {
        ...state,
        topAlbums: action.payload
      }
    case 'TOP_TRACKS':
      return {
        ...state,
        topTracks: action.payload
      }
    case 'TOP_ARTISTS':
      return {
        ...state,
        topArtists: action.payload
      }
    case 'JIO_SAVAN_CHARTS':
      return {
        ...state,
        charts: action.payload
      }
    case 'JIO_SAVAN_GENRES':
      return {
        ...state,
        genres: action.payload
      }
    case 'JIO_SAVAN_NEW_ALBUMS':
      return {
        ...state,
        newAlbums: action.payload
      }
    case 'TOP_KANNADA':
      return {
        ...state,
        topKannada: action.payload
      }
    case 'HOT_100':
      return {
        ...state,
        hot100: action.payload
      }
    default:
      return state;
  }
}

export default combineReducers({
  query: queryReducer,
  theme: themeReducer,
  media: mediaReducer,
  dashboard: dashboardReducer,
  settings: settingsReducer
});