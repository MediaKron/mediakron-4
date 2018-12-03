import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { Module } from 'vuex';

export const getInitialState = (checkLocalStorage = false) => {
  return {

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