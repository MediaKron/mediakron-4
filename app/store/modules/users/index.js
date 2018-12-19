import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import profile from './profile';
import { Module } from 'vuex';

export const getInitialState = (checkLocalStorage = false) => {
  let userToken;

  return {
    // Primary value holders
    'userList': [],
    'currentUser': false,

    // user List Statuses
    'userIsLoading':false,
    'userIsLoaded': false,
    'userIsError': false,

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

const user = {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules: {
    profile
  }
};

export default user;