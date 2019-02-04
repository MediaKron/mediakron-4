import api from '../../utils/api';
import router from '@/router';

const actions = {
    /**
     * Load a list of items
     * @param {*} param0
     * @param {*} options
     */
    loadItems({ commit, dispatch }, options) {
        commit("listLoading");

        return api.get('items', options)
                .then((response) => {
                commit("listLoad", response.data);
        commit("listPage", response.data);
        commit("listLoaded");

    })
    .catch((error) => {
            console.log(error);
        error.errorMessage = "There was an error loading the items list";
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