import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { Module } from 'vuex';

export const getInitialState = () => {
  return {
    // Primary value holders
    'siteList': [],

    // Site List Statuses
    'siteIsLoading':false,
    'siteIsLoaded': false,
    'siteIsError': false,

    'pagination' : {
      'currentPage': 1,
      'firstPage': 1,
      'lastPage': 1,
      'pageSize': 10,
      'totalItems': 10,
    },
    
    'currentSite': false,

    'listIsLoading': false,
    'listIsLoaded': false,
    'listIsError': false,
    'listIsEmpty': false,

    'editSite': {},
    'editPending': false,
    'siteIsSaving': false,
    'siteIsSaved': false,
    'siteSaveFailed': false,



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