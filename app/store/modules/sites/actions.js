import api from '../../utils/api';
import router from '@/router';

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
            console.log(error);
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
        commit("siteLoading");
    
        return api.get('site/'+id)
          .then((response) => {
            console.log(response.data);
            commit("siteLoad", response.data);
            commit("siteLoaded");
          })
          .catch((error) => {
            error.errorMessage = "There was an error loading the site";
            return dispatch("siteError", error);
          });
      },
}
export default actions;