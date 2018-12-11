import { MutationTree } from 'vuex';
import api from '@/store/utils/api';
import { getInitialState } from '@/store/modules/users';

export const mutations = {

    /**
     * Called when the list is loading
     * @param {*} state 
     */
    listLoading(state){
        state.listIsLoading = true;
        state.listIsLoaded = false;
        state.listIsFailed = false;
    },

    /**
     * Called after the list has loaded
     * @param {*} state 
     */
    listLoaded(state){
        state.listIsLoading = false;
        state.listIsLoaded = true;
        state.listIsFailed = false;
    },

    /**
     * Called with the data to load as the current list
     * @param {*} state 
     */
    listLoad(state, data){
        state.siteList = data;
    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state 
     */
    listPage(state, data){

    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state 
     */
    listError(state, error){
        console.log(error)
    }

}
export default mutations;