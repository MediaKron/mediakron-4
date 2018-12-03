import { GetterTree } from 'vuex';

export const getters = {
  isLoggedIn: state => !!state.currentToken,
};

export default getters;