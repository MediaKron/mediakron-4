import { MutationTree } from 'vuex';
import Site from './site';
import { getInitialState } from '@/store/modules/sites';

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
        state.siteList = data.data.map(site => new Site(site));
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
    },

    /**
     * Called when the list is loading
     * @param {*} state 
     */
    siteLoading(state){
        state.siteIsLoading = true;
        state.siteIsLoaded = false;
        state.siteIsFailed = false;
    },

    /**
     * Called after the list has loaded
     * @param {*} state 
     */
    siteLoaded(state){
        state.siteIsLoading = false;
        state.siteIsLoaded = true;
        state.siteIsFailed = false;
    },

    /**
     * Called with the data to load as the current list
     * @param {*} state 
     */
    siteLoad(state, data){
        state.currentSite = new Site(data);
    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state 
     */
    siteError(state, error){
        console.log(error)
    }

}
export default mutations;