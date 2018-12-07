import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { Module } from 'vuex';

export const getInitialState = () => {
  return {
    // Primary value holders
    'siteList': [],
    'currentSite': false,

    // Site List Statuses
    'siteIsLoading':false,
    'siteIsLoaded': false,
    'siteIsError': false,
    
    'listIsLoading': false,
    'listIsLoaded': false,
    'listIsError': false,
    'listIsEmpty': false,

    'pagination' : {
      'currentPage': 1,
      'firstPage': 1,
      'lastPage': 1,
      'pageSize': 15,
      'totalItems': 15,
    },

  };
};

export const state = getInitialState(true);

const user = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};

export default user;