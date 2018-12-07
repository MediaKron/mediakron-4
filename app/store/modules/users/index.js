import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import profile from './profile';
import { Module } from 'vuex';

export const getInitialState = (checkLocalStorage = false) => {
  let userToken;

  return {

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