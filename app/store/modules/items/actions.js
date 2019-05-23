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
        const { 
            search, 
            sort, 
            direction, 
            status, archived, 
            type, 
            title,
            user_id,
            editor_id
        } = to.query;

        //
        var options = {
          page: page || 0,
          search: search || '',
          sort: sort || 'id',
          direction: direction || 'ASC',
          status: status || '',
          archived: archived || '',
          type: type || '',
          title: title || '',
          editor_id: editor_id || '',
          user_id: user_id || ''
        }
        dispatch('loadItems', options);
    },

     /**
     * Dispatch this action when you want to load a site list
     * and make the site list sensitive to the query being
     * passed in from the router
     * @param {*} param0
     * @param {*} param1
     */
    loadExceptChildren({ commit, dispatch, getters, rootGetters }, { page, search, sort, direction }){
        //
        var currentItem = rootGetters['items/current'];
        var options = {
          page: page || 0,
          search: search || '',
          sort: sort || 'id',
          direction: direction || 'ASC',
          except_parent_id: currentItem.id
        }
        dispatch('loadItems', options);
      },

    /**
     * Dispatch this action when you want to load a site list
     * and make the site list sensitive to the query being
     * passed in from the router
     * @param {*} param0
     * @param {*} param1
     */
    itemsRouteLoad({ commit, dispatch }, { first, second, third }){
        dispatch('loadMultipleItems', [
            first, second, third
        ]);
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
        commit('setSite', currentSite)
        return api.get(url, options)
            .then((response) => {
                commit("listLoad", response.data, currentSite);
                commit("listPage", response.data);
            })
            .then(() => {
                commit("listLoaded");
            })
            .catch((error) => {
                error.errorMessage = "There was an error loading the items list";
                console.log(error);
                return dispatch("listError", error);
            });
    },

    /**
     * Load a list of items
     * @param {*} param0
     * @param {*} options
     */
    loadMultipleItems({ commit, dispatch, getters, rootGetters }, keys) {
        commit("itemLoading");
        var currentSite = rootGetters['sites/currentSite'],
            url = currentSite.id + '/items/multiple'
        commit('setSite', currentSite)
        return api.post(url, keys)
            .then((response) => {
                commit("itemLoad", response.data, currentSite);
            })
            .then(() => {
                commit("itemLoaded");
            })
            .catch((error) => {
                error.errorMessage = "There was an error loading the items list";
                return dispatch("listError", error);
            });
    },

    listError({}, error){
        console.log(error);
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
                    commit("itemLoad", response.data, currentSite);
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
    getTags({ commit, dispatch, rootGetters }) {
        commit("tagsLoading");
        var currentSite = rootGetters['sites/currentSite'],
        // Set the normal item create url
        url = currentSite.id + '/tags';
        return api.get(url)
            .then((response) => {
                console.log(response)
                commit("tagsLoad", response.data);
                commit("tagsLoaded");
        })
        .catch((error) => {
            console.log(error)
            error.errorMessage = "There was an error loading the item";
            throw error
            //return dispatch("itemError", error);
        });
    },

    /**
     * Load a single item
     * @param {*} param0
     * @param {*} id
     */
    update({ commit, state }, item) {
        if(JSON.stringify(item) !== JSON.stringify(state.editItem)){
            commit('updateItem', item);
        }
    },

    /**
     * Create an empty item
     * @param {*} param0
     * @param {*} id
     */
    createItem({ commit, state }, type) {
        commit("itemLoading");
        commit('createItem', type)
    },

    /**
     * Update an item
     * @param {*} param0
     * @param {*} id
     */
    saveItem({ commit, dispatch, state, getters, rootGetters }) {
        commit("itemSaving");
        // Get the current site
        var currentSite = rootGetters['sites/currentSite'],
            // Set the normal item create url
            url = currentSite.id + '/item',
            action = 'post';

        // If our item has an id, we're updating an existing item
        if(state.editItem.id){
            url = url + '/' + state.editItem.id;
            action = 'put';
        }  
        return api[action](url, state.editItem).then((response) => {
            commit("updateItem", response.data);
            commit("itemUpdated");
            if(action == 'post'){
                router.push({ path: '/' + currentSite.uri + '/' + response.data.uri })
            }
        })
        .catch((error) => {
            error.errorMessage = "There was an error saving the item";
            console.log(error)
            return dispatch("itemUpdateFailed", error);
        });
    },


    /**
     * Set editSite safe copy in state
     * @param {*} param0
     * @param {*} item
     */
    setEditItem({ commit, state }, item) {
        commit('editItemSet', item)
    },

    /**
     * Discard Edits
     * @param {*} param0
     * @param {*} item
     */
    discardEdits({ commit, state }) {
        commit('discardEdit')
    },

    /**
     * Upload an image
     * @param {*} param0
     * @param {*} id
     */
    upload({ commit, dispatch, state, getters, rootGetters }, event) {
        commit("uploading");

        // Get the current site
        let currentSite = rootGetters['sites/currentSite'],
            type = state.editItem.type,
            // Set the normal item create url
            url = currentSite.id + '/upload/' + type,
            file = event.target.files[0];
        api.upload(url, file, type).then((response) => {
            commit("upload", response.data);
        });
    },

    
}
export default actions;