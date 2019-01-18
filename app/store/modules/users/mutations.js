import { MutationTree } from 'vuex';
import api from '@/store/utils/api';
import { getInitialState } from '@/store/modules/users';
import User from './user';

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
        state.userList = data.data.map(user => new User(user));
    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state
     */
    listPage(state, data){
        state.pagination.currentPage = data.current_page;
        state.pagination.firstPage = 0;
        state.pagination.lastPage = data.last_page;
        state.pagination.pageSize = data.per_page;
        state.pagination.totalItems = data.total;
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
    userLoading(state){
        state.userIsLoading = true;
        state.userIsLoaded = false;
        state.userIsFailed = false;
    },

    /**
     * Called after the list has loaded
     * @param {*} state
     */
    userLoaded(state){
        state.userIsLoading = false;
        state.userIsLoaded = true;
        state.userIsFailed = false;
    },

    /**
     * Called with the data to load as the current list
     * @param {*} state
     */
    userLoad(state, data){
        state.currentUser = new User(data);
    },

    /**
     * List Page.  Set the pager information from the request
     * @param {*} state
     */
    userError(state, error){
        console.log(error)
    }
}
export default mutations;
