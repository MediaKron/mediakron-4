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
            console.log(response)
            //commit("login", response.data);
            //commit("loginSuccess");
          })
          .then(() => {
            // TODO: dispatch event action
          })
          .then(() => {
            //return router.push({ name: 'homepage' });
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

//amertz@bouldermedicalcenter.com