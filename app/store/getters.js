import { GetterTree } from 'vuex';

export const getters = {
  isLoggedIn: state => !!state.currentToken,
  progress: state => state.progress,
  isProgressing: (state) => {
    return state.progress > 0 && state.progress < 100;
  }
};

export default getters;