import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import User from '../user';
import { Module } from 'vuex';

export const getInitialState = (checkLocalStorage = false) => {

  return {
    currentToken: false,

    loginStatus: false,
    loginPending: false,
    loginSuccess: false,
    loginFailed: false,

    user: User.guest(),

    

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