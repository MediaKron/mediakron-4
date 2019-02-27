import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { Module } from 'vuex';

export const getInitialState = (checkLocalStorage = false) => {
  return {
    site: {},
    
    tags: [],

    items: [],
    first: {},
    second: {},
    third: {},

    isEditing: false,
    editItem: {},

    // Item List Statuses
    'itemIsLoading':false,
    'itemIsLoaded': false,
    'itemIsError': false,

    'listIsLoading': false,
    'listIsLoaded': false,
    'listIsError': false,
    'listIsEmpty': false,

    'pagination' : {
      'currentPage': 1,
      'firstPage': 1,
      'lastPage': 1,
      'pageSize': 10,
      'totalItems': 10,
    },
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