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
        dispatch('loadUsers', options);
      },
      /**
       * Load a list of sites
       * @param {*} param0 
       * @param {*} options 
       */
      loadUsers({ commit, dispatch }, options) {
          commit("listLoading");
      
          return api.get('users', options)
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
      getUser({ commit, dispatch }, id) {
          commit("siteLoading");
      
          return api.get('user/'+id)
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