import api from '../../../utils/api';
import router from '@/router';

const actions = {
    /**
     * Load a list of sites
     * @param {*} param0 
     * @param {*} options 
     */
    login({ commit, dispatch }, credentials) {
        commit("loggingIn");
    
        return api.post('auth/login', credentials)
          .then((response) => {
            commit("login", response.data);
            commit("loggedIn");
          })
          .catch((error) => {
            console.log(error);
            error.errorMessage = "The Login failed";
            return dispatch("loginError", error);
          });
      },
}
export default actions;

//amertz@bouldermedicalcenter.com