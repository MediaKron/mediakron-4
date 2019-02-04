import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { Module } from 'vuex';

export const getInitialState = (checkLocalStorage = false) => {
  return {
    tags: [],
    items: [],
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