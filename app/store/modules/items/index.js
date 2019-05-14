import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { Module } from 'vuex';

export const getInitialState = (checkLocalStorage = false) => {
  return {
    site: {},
    
    tags: [],

    itemList: [],
    current: {},
    first: {},
    second: {},
    third: {},

    isEditing: false,
    isCreating: false,
    editItem: {},

    // Item List Statuses
    'itemIsLoading':false,
    'itemIsLoaded': false,
    'itemIsError': false,

    'listIsLoading': false,
    'listIsLoaded': false,
    'listIsError': false,
    'listIsEmpty': false,

    'tagsLoading': false,
    'tagsLoaded': false,

    'isUploading': false,
    'isUploaded': false,

    'pagination' : {
      'currentPage': 1,
      'firstPage': 1,
      'lastPage': 1,
      'pageSize': 10,
      'totalItems': 10,
    },

    'count': {
      'collection': 0,
      'image': 0,
      'video': 0,
      'audio': 0,
      'map': 0,
      'timeline': 0,
      'story': 0,
      'file': 0
    }
  };
};

export const state = getInitialState(true);

const item = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default item;