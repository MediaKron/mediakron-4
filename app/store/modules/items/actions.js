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
        dispatch('loadItems', options);
        
      },

    /**
     * Load a list of items
     * @param {*} param0
     * @param {*} options
     */
    loadItems({ commit, dispatch, getters, rootGetters }, options) {
        commit("listLoading");
        let url = 'items';
        var currentSite = rootGetters['sites/currentSite'];
        if(currentSite){
            url = currentSite.id + '/items'
        }
        return api.get(url, options)
            .then((response) => {
                console.log('loading item list')
                commit("listLoad", response.data);
                commit("listPage", response.data);
            })
            .then(() => {
                console.log('list loaded')
                commit("listLoaded");
            })
            .catch((error) => {
                error.errorMessage = "There was an error loading the items list";
                console.log(error);
                return dispatch("listError", error);
            });
    },

    /**
     * Load a single item
     * @param {*} param0
     * @param {*} id
     */
    getItem({ commit, dispatch }, id) {
        commit("itemLoading");

        return api.get('item/'+id)
                .then((response) => {
                commit("itemLoad", response.data);
        commit("itemLoaded");
    })
    .catch((error) => {
            error.errorMessage = "There was an error loading the item";
        return dispatch("itemError", error);
    });
    },

    /**
     * Load a single item
     * @param {*} param0
     * @param {*} id
     */
    update({ commit, state }, item) {
        if(JSON.stringify(site) !== JSON.stringify(state.editSite)){
            commit('updateItem', item);
        }
    },

    /**
     * Load a single site
     * @param {*} param0
     * @param {*} id
     */
    saveItem({ commit, state }) {
        commit("itemSaving");
        return api.post('item/' + state.currentItem.id, state.editItem)
                .then((response) => {
                commit("itemUpdate", response.data);
        commit("itemUpdated");
    })
    .catch((error) => {
            error.errorMessage = "There was an error saving the item";
        return dispatch("itemUpdateFailed", error);
    });
    },
    
}
export default actions;