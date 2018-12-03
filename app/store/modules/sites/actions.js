import api from '../../utils/api';
import router from '@/router';
import { AxiosResponse, AxiosError } from 'axios';

const actions = {
    /**
     * Load a list of sites
     * @param {*} param0 
     * @param {*} options 
     */
    loadSites({ commit, dispatch }, options) {
        commit("listLoading");
    
        return api.get('sites', options)
          .then((response) => {
            commit("listLoad", response.data);
            commit("listPage", response.data);
            commit("listLoaded");
          })
          .catch((error) => {
            error.errorMessage = "There was an error loading the site list";
            return dispatch("listError", error);
          });
      },

      /**
       * Load a single site
       * @param {*} param0 
       * @param {*} id 
       */
    getSite({ commit, dispatch }, id) {
        commit("listLoading");
    
        return api.get('sites/'+id)
          .then((response) => {
            commit("siteLoad", response.data);
            commit("siteLoaded");
          })
          .catch((error) => {
            error.errorMessage = "There was an error loading the site list";
            return dispatch("siteError", error);
          });
      },
}
export default actions;