import api from '../../../utils/api';
import router from '@/router';

const actions = {
    /**
     * Load a list of sites
     * @param {*} param0 
     * @param {*} options 
     */
    login({ commit, dispatch }, credentials) {
        commit("loginPending");
        commit("setToken", false);
        console.log(credentials)
        return api.post('auth/login', credentials)
          .then((response) => {
            commit('setToken', response.data.access_token)
            commit("login", response.data);
            commit("loginSuccess");
          })
          .then(() => {
            // TODO: dispatch event action
            // Dispatch notifications
          })
          .then(() => {
            return router.push({ name: 'homepage' });
          })
          .catch((error) => {
            console.log(error);
            error.errorMessage = "The login failed";
            commit("loginError", error);
            // TODO Dispatch error event action
          });
      },
}
export default actions;