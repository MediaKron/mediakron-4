import api from '../../utils/api';
import router from '@/router';

const actions = {

    /**
     * Dispatch this action when you want to load a site list
     * and make the site list sensitive to the query being
     * passed in from the router
     * @param {*} param0
     * @param {*} param1
     */
    routeLoad({ commit, dispatch }, { to }){
      const { page } = to.params;
      const { search, sort, direction, status } = to.query;
      //
      var options = {
        page: page || 0,
        search: search || '',
        sort: sort || 'id',
        direction: direction || 'ASC',
        status: status || ''
      }
      dispatch('loadSites', options);
    },
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
            commit("siteLoad", response.data);
            commit("siteLoaded");
          })
          .catch((error) => {
            error.errorMessage = "There was an error loading the site";
            return dispatch("siteError", error);
          });
      },

      /**
       * Load a single site
       * @param {*} param0 
       * @param {*} id 
       */
    update({ commit, state }, site) {
      if(JSON.stringify(site) !== JSON.stringify(state.editSite)){
        commit('updateSite', site);
      }
    },

    /**
       * Load a single site
       * @param {*} param0 
       * @param {*} id 
       */
      saveSite({ commit, state }) {
        commit("siteSaving");
        return api.post('site/' + state.currentSite.id, state.editSite)
          .then((response) => {
            commit("siteUpdate", response.data);
            commit("siteUpdated");
          })
          .catch((error) => {
            error.errorMessage = "There was an error saving the site";
            return dispatch("siteUpdateFailed", error);
          });
      },
}
export default actions;
